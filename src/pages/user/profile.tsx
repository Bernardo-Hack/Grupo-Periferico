// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../layouts/shared/navbar';
import { useTheme } from '../../contexts/ThemeContext';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../../layouts/style/profileCSS.css';
import '../../layouts/style/globalCSS.css';

interface DoacaoDinheiro {
  id: number;
  valor: number;
  metodo: string;
  data_doacao: string;
}

interface DoacaoRoupa {
  id: number;
  descricao: string;
  quantidade: number;
  tamanho?: string;
  data_doacao: string;
}

interface DoacaoAlimento {
  id: number;
  descricao: string;
  quantidade_kg: number;
  data_doacao: string;
}

interface UserProfile {
  nome: string;
  telefone: string;
  data_cadastro: string;
  data_nascimento?: string;
}

interface ProfileData {
  user: UserProfile;
  doacoesDinheiro: DoacaoDinheiro[];
  doacoesRoupa: DoacaoRoupa[];
  doacoesAlimento: DoacaoAlimento[];
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nome: '', telefone: '', data_nascimento: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const apiUrl = process.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        navigate('/registro');
        return;
      }

      const res = await fetch(`${apiUrl}/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('jwtToken');
        navigate('/registro');
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      if (data.doacoesDinheiro) {
        data.doacoesDinheiro = data.doacoesDinheiro.map((d: any) => ({
          ...d,
          valor: typeof d.valor === 'string' ? parseFloat(d.valor) : d.valor
        }));
      }

      if (data.doacoesAlimento) {
        data.doacoesAlimento = data.doacoesAlimento.map((d: any) => ({
          ...d,
          quantidade_kg: typeof d.quantidade_kg === 'string' ? parseFloat(d.quantidade_kg) : d.quantidade_kg
        }));
      }

      setProfile(data);
      setEditForm({
        nome: data.user.nome,
        telefone: data.user.telefone,
        data_nascimento: data.user.data_nascimento || ''
      });

    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err);
      setError(err.message || 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(`${apiUrl}/user/edt_profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      Swal.fire('Sucesso', 'Perfil atualizado com sucesso!', 'success');
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      Swal.fire('Erro', err.message || 'Erro ao atualizar perfil', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    const { value: password } = await Swal.fire({
      title: 'Confirmar exclusão de conta',
      text: 'Esta ação é irreversível! Digite sua senha para confirmar:',
      input: 'password',
      inputPlaceholder: 'Sua senha',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Excluir conta',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor, digite sua senha!';
        }
      }
    });

    if (password) {
      try {
        const res = await fetch(`${apiUrl}/user/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ senha: password })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Erro ao excluir conta');
        }

        await Swal.fire({
          title: 'Conta excluída!',
          text: 'Sua conta foi excluída com sucesso.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });

        navigate('/');

      } catch (err: any) {
        Swal.fire({
          title: 'Erro',
          text: err.message || 'Falha ao excluir conta',
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p>Carregando perfil...</p></div>;
  }

  if (error) {
    return <div className="error-container"><h2>Erro ao carregar perfil</h2><p>{error}</p><button onClick={() => window.location.reload()}>Tentar novamente</button></div>;
  }

  return (
    <div className={`profile-page ${theme}`}>
      <Navbar />
      <br></br>
      <br></br>
      <header className="profile-header">
        <div className="header-content">
          <div className="profile-info">
            <div className="user-details">
              {editing ? (
                <div className="edit-form">
                  <input type="text" value={editForm.nome} onChange={e => setEditForm({ ...editForm, nome: e.target.value })} placeholder="Nome" />
                  <input type="text" value={editForm.telefone} onChange={e => setEditForm({ ...editForm, telefone: e.target.value })} placeholder="Telefone" />
                  <input type="date" value={editForm.data_nascimento} onChange={e => setEditForm({ ...editForm, data_nascimento: e.target.value })} placeholder="Data de Nascimento" />
                  <button onClick={handleUpdateProfile}>Salvar</button>
                  <button onClick={() => setEditing(false)}>Cancelar</button>
                </div>
              ) : profile?.user ? (
                <>
                  <h1>{profile.user.nome}</h1>
                  <p>Telefone: {profile.user.telefone}</p>
                  <p>Membro desde: {profile.user.data_cadastro}</p>
                  <button className="edit-profile-btn" onClick={() => setEditing(true)}>Editar Perfil</button>
                </>
              ) : <p>Dados do usuário não encontrados</p>}

              <div className="theme-selector">
                <label htmlFor="theme-toggle">Modo Escuro:</label>
                <button id="theme-toggle" className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Desativar modo escuro' : 'Ativar modo escuro'}>
                  <div className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}><div className="switch-handle"></div></div>
                  <span>{theme === 'dark' ? 'Ativado' : 'Desativado'}</span>
                </button>
              </div>

              <div className="delete-account-section">
                <button className="delete-account-btn" onClick={handleDeleteAccount}>Excluir Minha Conta</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="profile-content">
        <section className="donations-section">
          <h2>Minhas Doações</h2>

          {(profile?.doacoesDinheiro?.length ?? 0) > 0 && (
            <>
              <ul>
                <h3>Doações em Dinheiro</h3>
                {profile?.doacoesDinheiro.map(d => (
                  <li key={`d-${d.id}`}><strong>R$ {d.valor.toFixed(2)}</strong> via {d.metodo} em {d.data_doacao}</li>
                ))}
              </ul>
            </>
          )}

          {(profile?.doacoesRoupa?.length ?? 0) > 0 && (
            <>
              <ul>
                <h3>Doações de Roupas</h3>
                {profile?.doacoesRoupa.map(d => (
                  <li key={`r-${d.id}`}>{d.quantidade}x {d.descricao} (tamanho {d.tamanho || 'N/A'}) em {d.data_doacao}</li>
                ))}
              </ul>
            </>
          )}

          {(profile?.doacoesAlimento?.length ?? 0) > 0 && (
            <>
              <ul>
                <h3>Doações de Alimentos</h3>
                {profile?.doacoesAlimento.map(d => (
                  <li key={`a-${d.id}`}>{d.quantidade_kg.toFixed(2)} kg de {d.descricao} em {d.data_doacao}</li>
                ))}
              </ul>
            </>
          )}

          {profile &&
            profile.doacoesDinheiro.length === 0 &&
            profile.doacoesRoupa.length === 0 &&
            profile.doacoesAlimento.length === 0 && (
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