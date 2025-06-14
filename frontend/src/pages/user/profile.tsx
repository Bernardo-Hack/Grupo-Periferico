import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/profileCSS.css';

interface Doacao {
  id: number;
  valor: number;
  metodo: string;
  data_doacao: string;
}

interface UserProfile {
  nome: string;
  telefone: string;
  data_cadastro: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<{
    user?: UserProfile;
    doacoes?: Doacao[];
  }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/user/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 401) {
          // Usuário não autenticado, redirecionar para login
          navigate('/registro');
          return null;
        }
        if (!res.ok) throw new Error('Erro ao carregar perfil');
        return res.json();
      })
      .then(data => {
        if (data) setProfile(data);
      })
      .catch(err => {
        console.error('Erro ao buscar perfil:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const { user, doacoes } = profile;

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div className="profile-page">
      <Navbar />
      <header className="profile-header">
        <div className="header-content">
          <div className="profile-info">
            <div className="user-details">
              <h1>{user?.nome}</h1>
              <p>Telefone: {user?.telefone}</p>
              <p>Membro desde: {user?.data_cadastro}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="profile-content">
        <section className="donations-section">
          <h2>Minhas Doações</h2>
          {doacoes && doacoes.length > 0 ? (
            <ul>
              {doacoes.map(d => (
                <li key={d.id}>
                  <strong>R$ {d.valor.toFixed(2)}</strong> via {d.metodo} em {d.data_doacao}
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não fez nenhuma doação.</p>
          )}
        </section>
      </main>

      <footer className="profile-footer">
        <p>© 2025 Grupo Periférico. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Profile;
