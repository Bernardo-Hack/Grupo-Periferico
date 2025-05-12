import React from 'react';
import { Navbar } from '../../layouts/shared/navbar';

const Profile: React.FC = () => {
    const user = {
        name: 'Bernardo Hack',
        email: 'bernardo@example.com',
        location: 'São Paulo, Brasil',
        bio: 'Desenvolvedor apaixonado por tecnologia e inovação. Contribuindo para projetos open-source e sempre aprendendo novas habilidades.',
        joined: 'Junho de 2022',
        skills: ['React', 'TypeScript', 'Node.js', 'UI/UX'],
        website: 'https://github.com/Bernardo-Hack'
    };

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
                            <h1>{user.name}</h1>
                            <p className="location">{user.location}</p>
                            <button className="btn btn-primary">Editar Perfil</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="profile-content">
                <div className="container">
                    <div className="profile-grid">
                        {/* Coluna Esquerda */}
                        <div className="profile-section">
                            <h2>Sobre Mim</h2>
                            <p className="bio">{user.bio}</p>
                            
                            <div className="details">
                                <div className="detail-item">
                                    <i className="fas fa-envelope"></i>
                                    <span>{user.email}</span>
                                </div>
                                <div className="detail-item">
                                    <i className="fas fa-globe"></i>
                                    <a href={user.website} target="_blank" rel="noopener noreferrer">
                                        {user.website}
                                    </a>
                                </div>
                                <div className="detail-item">
                                    <i className="fas fa-calendar-alt"></i>
                                    <span>Membro desde {user.joined}</span>
                                </div>
                            </div>
                        </div>

                        {/* Coluna Direita */}
                        <div className="profile-section">
                            <h2>Habilidades</h2>
                            <div className="skills-container">
                                {user.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <h2>Preferências</h2>
                            <div className="preferences">
                                <div className="pref-item">
                                    <span>Idioma:</span>
                                    <span>Português (Brasil)</span>
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
                <p>© 2024 Grupo Periférico. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Profile;