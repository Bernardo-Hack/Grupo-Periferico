import React from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/donations_global.css';

const Clothes: React.FC = () => {
  return (
    <div className="clothesfoods-page">
      <Navbar />

      <header className="donation-header">
        <div className="header-content">
          <h1>Doação de Roupas</h1>
          <p>
            Contribua com roupas em bom estado para ajudar comunidades em situação de vulnerabilidade.
          </p>
        </div>
      </header>

      <section className="donation-banner">
        <img
          src="\src\assets\images\istockphoto-2171792150-612x612.jpg"
          alt="Doação de Roupas"
        />
      </section>

      {/* Blocos de impacto (iguais aos da monetária) */}
      <section className="donation-info">
        <div className="info-item">
          <i className="fas fa-hands-helping icon"></i>
          <h3>Solidariedade</h3>
          <p>
            Suas roupas podem aquecer o corpo e a alma de quem mais precisa.
          </p>
        </div>
        <div className="info-item">
          <i className="fas fa-tshirt icon"></i>
          <h3>Roupas com Destino</h3>
          <p>
            As doações são direcionadas para comunidades em situação de vulnerabilidade.
          </p>
        </div>
        <div className="info-item">
          <i className="fas fa-people-carry icon"></i>
          <h3>Transformação Social</h3>
          <p>
            Incentivamos a reutilização consciente e o impacto social positivo.
          </p>
        </div>
      </section>

      <section className="donation-form-section">
        <div className="form-info">
          <p>Preencha os dados abaixo para doar roupas:</p>
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
            <label htmlFor="tipo">Tipo de Roupa</label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              placeholder="Ex: Camisetas, Calças"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantidade">Quantidade</label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tamanho">Tamanho</label>
              <select id="tamanho" name="tamanho">
                <option value="">Selecione</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-donation">
            Doar Roupas
          </button>
        </form>
      </section>
    </div>
  );
};

export default Clothes;
