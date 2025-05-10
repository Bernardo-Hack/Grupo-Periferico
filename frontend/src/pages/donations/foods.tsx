import React from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';
import '../../layouts/style/donations_global.css';

const Foods: React.FC = () => {
  return (
    <div className="clothesfoods-page">
      <Navbar />

      <header className="donation-header">
        <div className="header-content">
          <h1>Doação de Alimentos</h1>
          <p>
            Sua contribuição com alimentos não perecíveis faz a diferença na vida de quem mais precisa.
          </p>
        </div>
      </header>

      <section className="donation-banner">
        <img
          src="\src\assets\images\photo-1599059813005-11265ba4b4ce.avif"
          alt="Doação de Alimentos"
        />
      </section>

      {/* Blocos de impacto (iguais aos da monetária) */}
      <section className="donation-info">
        <div className="info-item">
          <i className="fas fa-apple-alt icon"></i>
          <h3>Alimentos que Alimentam</h3>
          <p>
            Cada doação garante refeições mais dignas a famílias inteiras.
          </p>
        </div>
        <div className="info-item">
          <i className="fas fa-seedling icon"></i>
          <h3>Apoio Sustentável</h3>
          <p>
            Doações são organizadas para distribuição responsável e eficiente.
          </p>
        </div>
        <div className="info-item">
          <i className="fas fa-users icon"></i>
          <h3>Comunidade Mais Forte</h3>
          <p>
            Alimentar é também cuidar, fortalecer laços e transformar realidades.
          </p>
        </div>
      </section>

      <section className="donation-form-section">
        <div className="form-info">
          <p>Preencha os dados abaixo para doar alimentos:</p>
        </div>

        <form className="donation-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Alimento</label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              placeholder="Ex: Arroz, Feijão"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade (kg)</label>
            <input
              type="number"
              id="quantidade"
              name="quantidade"
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <button type="submit" className="submit-donation">
            Doar Alimentos
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Foods;
