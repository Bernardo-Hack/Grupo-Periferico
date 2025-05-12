import React from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/donations_global.css';


const Monetary: React.FC = () => {
  return (
    <div className="monetary-page">
      <Navbar />

      {/* Header com mensagem de impacto */}
      <header className="donation-header">
        <div className="header-content">
          <h1>Ajude a Transformar Vidas</h1>
          <p>
            Sua contribuição financeira é a força que impulsiona nossos projetos e transforma realidades. 
            Com cada doação, possibilitamos ações que mudam a vida de comunidades e promovem um futuro mais justo e sustentável.
          </p>
        </div>
      </header>

      {/* Banner com imagem grande */}
      <section className="donation-banner">
        <img
          src="src/assets/images/photo-1542367787-4baf35f3037d.avif"
          alt="Banner de Doação"
        />
      </section>

      {/* Seção de Informações (impacto) com ícones */}
      <section className="donation-info">
        <div className="info-item">
            <i className="fas fa-hand-holding-dollar icon"></i>
            <h3>Transparência Total</h3>
            <p>
            Cada centavo é rastreado e aplicado com total clareza, permitindo que você acompanhe o impacto da sua doação.
            </p>
        </div>

        <div className="info-item">
            <i className="fas fa-piggy-bank icon"></i>
            <h3>Investimento no Futuro</h3>
            <p>
            Sua ajuda não só alivia emergências, mas também investe no desenvolvimento de projetos que constroem um amanhã melhor.
            </p>
        </div>

        <div className="info-item">
            <i className="fas fa-handshake-angle icon"></i>
            <h3>Cuidado e Impacto Social</h3>
            <p>
            Ao doar, você fortalece iniciativas que promovem inclusão, apoio a imigrantes e oportunidades para comunidades em vulnerabilidade.
            </p>
        </div>
        </section>

      {/* Seção do Formulário de Doação (relacionado à tabela DoacaoDinheiro) */}
      <section className="donation-form-section">
        <h2>Faça sua doação</h2>
        <form className="donation-form">
            {/* Dados do usuário */}
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" required />

            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" required />

            {/* Campos específicos para doação monetária */}
            <label htmlFor="valor">Valor (R$)</label>
            <input 
            type="number" 
            id="valor" 
            name="valor" 
            min="1" 
            step="0.01" 
            required 
            />

            <label htmlFor="metodo_pagamento">Método de Pagamento</label>
            <select id="metodo_pagamento" name="metodo_pagamento" required>
            <option value="">Selecione</option>
            <option value="pix">PIX</option>
            <option value="cartao">Cartão de Crédito/Débito</option>
            <option value="boleto">Boleto Bancário</option>
            </select>

            <button type="submit" className="submit-donation">
            Confirmar Doação
            </button>
        </form>
        </section>
    </div>
  );
};

export default Monetary;