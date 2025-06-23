import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../layouts/shared/navbar';

type UsuarioStatus = { nome: string; status: 'Ativo' | 'Inativo' };

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [usuariosStatus, setUsuariosStatus] = useState<UsuarioStatus[]>([]);
  
  const navigate = useNavigate();
  const apiUrl = process.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');

  // Verifica se o admin está logado
  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetch(`${apiUrl}/admin/check-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('jwtToken');
          navigate('/admin/login');
          throw new Error('Sessão expirada ou inválida.');
        }
        setIsLoading(false);
        return res.json();
      })
      .catch(() => {
        navigate('/admin/login');
      });
  }, [navigate, apiUrl, token]);

  // Busca a lista de usuários com status ativo/inativo
  const fetchUsuariosStatus = async () => {
    setIsFetching(true);
    setFetchError(null);

    try {
      const res = await fetch(`${apiUrl}/api/graficos/usuarios/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(`Erro ao buscar usuários: ${res.statusText}`);

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsuariosStatus(data);
      } else {
        setFetchError('Resposta inesperada da API.');
      }
    } catch (error: any) {
      setFetchError(error.message || 'Erro ao buscar usuários.');
    } finally {
      setIsFetching(false);
    }
  };

  // Chama a busca dos usuários depois que o token for validado
  useEffect(() => {
    if (!isLoading) {
      fetchUsuariosStatus();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        Carregando...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="admin-page">
        <Navbar />
        <div className="text-center mt-5" style={{ color: 'red' }}>
          <h3>Ocorreu um erro ao carregar os usuários</h3>
          <p>{fetchError}</p>
          <button onClick={fetchUsuariosStatus} disabled={isFetching} className="btn btn-primary">
            {isFetching ? 'Tentando...' : 'Tentar Novamente'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />
      <br /><br />
      <div className="admin-chart-section">
        <div className="admin-chart-container">
          <h4 className="admin-chart-title">Status dos Usuários</h4>
          {usuariosStatus.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <ul>
              {usuariosStatus.map((usuario, index) => (
                <li
                  key={index}
                  style={{
                    color: usuario.status === 'Ativo' ? '#28a745' : '#6c757d',
                    fontWeight: 500
                  }}
                >
                  {usuario.nome} - {usuario.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;