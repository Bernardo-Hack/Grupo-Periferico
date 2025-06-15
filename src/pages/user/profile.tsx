import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../layouts/shared/navbar';
import { useTheme } from '../../contexts/ThemeContext';
import '../../layouts/style/profileCSS.css';
import '../../layouts/style/globalCSS.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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

interface ProfileData {
  user: UserProfile;
  doacoes: Doacao[];
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('http://localhost:5000/user/profile', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.status === 401) {
        navigate('/registro');
        return;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }
      
      const data = await res.json();
      
      // Verificar e converter valores numéricos
      if (data.doacoes) {
        data.doacoes = data.doacoes.map((d: any) => ({
          ...d,
          valor: typeof d.valor === 'string' ? parseFloat(d.valor) : d.valor
        }));
      }
      
      setProfile(data);
      
    } catch (err: any) {
      console.error('Erro ao buscar perfil:', err);
      setError(err.message || 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
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
        const res = await fetch('http://localhost:5000/user/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
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

        // Redirecionar para página inicial
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
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erro ao carregar perfil</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className={`profile-page ${theme}`}>
      <Navbar />
      <header className="profile-header">
        <div className="header-content">
          <div className="profile-info">
            <div className="user-details">
              {profile?.user ? (
                <>
                  <h1>{profile.user.nome}</h1>
                  <p>Telefone: {profile.user.telefone}</p>
                  <p>Membro desde: {profile.user.data_cadastro}</p>
                </>
              ) : (
                <p>Dados do usuário não encontrados</p>
              )}
              
              <div className="theme-selector">
                <label htmlFor="theme-toggle">Modo Escuro:</label>
                <button 
                  id="theme-toggle"
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Desativar modo escuro' : 'Ativar modo escuro'}
                >
                  <div className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}>
                    <div className="switch-handle"></div>
                  </div>
                  <span>{theme === 'dark' ? 'Ativado' : 'Desativado'}</span>
                </button>
              </div>
              
              <div className="delete-account-section">
                <button 
                  className="delete-account-btn"
                  onClick={handleDeleteAccount}
                >
                  Excluir Minha Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="profile-content">
        <section className="donations-section">
          <h2>Minhas Doações</h2>
          {profile?.doacoes && profile.doacoes.length > 0 ? (
            <ul>
              {profile.doacoes.map(d => (
                <li key={d.id}>
                  <strong>R$ {typeof d.valor === 'number' ? d.valor.toFixed(2) : 'Valor inválido'}</strong> 
                  {' '}via {d.metodo} em {d.data_doacao}
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