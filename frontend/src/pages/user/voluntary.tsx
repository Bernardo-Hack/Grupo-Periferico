import React from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';

const Voluntary: React.FC = () => {
  return (
    <div className="monetary-page">
      <Navbar />

      {/* Header com chamada para voluntariado */}
      <header className="donation-header" style={{ background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.85)' }}>
        <div className="header-content">
          <h1>Seja um Voluntário Transformador</h1>
          <p>
            Sua participação direta faz a diferença! Escolha o tipo de doação que deseja apoiar e junte-se à nossa rede de solidariedade. 
            Cada gesto voluntário fortalece comunidades e constrói pontes de esperança.
          </p>
        </div>
      </header>

      {/* Banner com imagem de voluntários */}
      <section className="donation-banner">
        <img
          src="src\assets\images\premium_photo-1683140516842-74c378a43d76.avif"
          alt="Voluntários trabalhando juntos"
        />
      </section>

      {/* Seção de Benefícios do Voluntariado */}
      <section className="donation-info">
        <div className="info-item">
          <i className="fas fa-hands-helping icon"></i>
          <h3>Impacto Direto</h3>
          <p>
            Veja de perto o resultado do seu trabalho e como ele transforma realidades diariamente.
          </p>
        </div>
        <div className="info-item">
          <i className="fas fa-users icon"></i>
          <h3>Comunidade Ativa</h3>
          <p>
            Conecte-se com outros voluntários e crie laços enquanto faz o bem.
          </p>
        </div>
        <div className="info-item">
          <i className="fas fa-award icon"></i>
          <h3>Reconhecimento</h3>
          <p>
            Receba certificados de participação e seja reconhecido por seu impacto social.
          </p>
        </div>
      </section>

      {/* Seção de Escolha de Tipo de Doação */}
      <section className="donation-form-section">
        <h2>Escolha Sua Forma de Apoio</h2>
        <div className="form-info">
          <p>
            Selecione o tipo de doação que deseja apoiar como voluntário. Você pode participar da organização, 
            distribuição ou captação de recursos para cada uma destas causas:
          </p>
        </div>

        <div className="voluntary-options">
          {/* Card para Doação Financeira */}
          <div className="voluntary-card">
            <i className="fas fa-hand-holding-dollar card-icon"></i>
            <h3>Apoio Financeiro</h3>
            <p>
              Ajude na captação de recursos, organização de eventos beneficentes ou gestão transparente das doações.
            </p>
            <button className="voluntary-select">Selecionar</button>
          </div>

          {/* Card para Doação de Roupas */}
          <div className="voluntary-card">
            <i className="fas fa-tshirt card-icon"></i>
            <h3>Doação de Roupas</h3>
            <p>
              Participe da triagem, organização e distribuição de vestuário para comunidades necessitadas.
            </p>
            <button className="voluntary-select">Selecionar</button>
          </div>

          {/* Card para Doação de Alimentos */}
          <div className="voluntary-card">
            <i className="fas fa-utensils card-icon"></i>
            <h3>Doação de Alimentos</h3>
            <p>
              Colabore com a coleta, embalagem e distribuição de cestas básicas e alimentos não perecíveis.
            </p>
            <button className="voluntary-select">Selecionar</button>
          </div>
        </div>

        {/* Formulário de Cadastro para Voluntário */}
        <form className="donation-form voluntary-form">
          <h3>Preencha seus dados para participar</h3>

          <label htmlFor="fullName">Nome Completo</label>
          <input type="text" id="fullName" required />

          <label htmlFor="volunteerEmail">E-mail</label>
          <input type="email" id="volunteerEmail" required />

          <label htmlFor="availability">Disponibilidade</label>
          <select id="availability" required>
            <option value="">Selecione</option>
            <option value="weekly">Algumas horas por semana</option>
            <option value="event">Apenas para eventos específicos</option>
            <option value="full">Tempo integral</option>
          </select>

          <label htmlFor="experience">Experiência Anterior (opcional)</label>
          <textarea id="experience" rows={3}></textarea>

          <button type="submit" className="submit-donation">
            Tornar-se Voluntário
          </button>
        </form>
      </section>
      <Footer />
    </div>
    
  );
};

export default Voluntary;