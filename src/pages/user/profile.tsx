import React, { useEffect, useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/user/profile', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Erro ao buscar perfil:', err));
  }, []);

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="profile-page">
      <Navbar />
      <header className="profile-header">
        <div className="header-content">
          <div className="profile-info">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="profile-pic"
            />
            <div className="user-details">
              <h1>{user.nome}</h1>
              <p className="location">Localização: {user.localizacao || 'Não informada'}</p>
              <button className="btn btn-primary">Editar Perfil</button>
            </div>
          </div>
        </div>
      </header>
      <main className="profile-content">
        <div className="container">
          <div className="profile-grid">
            <div className="profile-section">
              <h2>Sobre Mim</h2>
              <p className="bio">{user.bio || 'Bio não informada.'}</p>
              <div className="details">
                <div className="detail-item">
                  <i className="fas fa-envelope"></i>
                  <span>{user.email || 'Email não informado'}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Membro desde {user.data_cadastro || 'Data não disponível'}</span>
                </div>
              </div>
            </div>
            <div className="profile-section">
              <h2>Habilidades</h2>
              <div className="skills-container">
                {user.habilidades?.map((skill: string, index: number) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                )) || <p>Nenhuma habilidade informada.</p>}
              </div>
              <h2>Preferências</h2>
              <div className="preferences">
                <div className="pref-item">
                  <span>Idioma:</span>
                  <span>{user.idioma || 'Português (Brasil)'}</span>
                </div>
                <div className="pref-item">
                  <span>Modo Escuro:</span>
                  <button className="btn btn-secondary">Ativar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="profile-footer">
        <p>© 2025 Grupo Periférico. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Profile;
