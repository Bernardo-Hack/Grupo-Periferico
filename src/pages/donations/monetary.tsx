import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/donations_global.css';

const Monetary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = {
      valor: parseFloat(e.currentTarget.valor.value),
      metodo_pagamento: e.currentTarget.metodo_pagamento.value,
      nome: e.currentTarget.nome.value,
      email: e.currentTarget.email.value
    };

    try {
      const response = await fetch('http://localhost:5000/api/doacoes/dinheiro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar doação');
      }

      window.location.href = '/doacao/sucesso';
      
    } catch (err) {
      setError(err.message || 'Ocorreu um erro inesperado');
      console.error('Erro na doação:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monetary-page">
      <Navbar />

      {/* Header */}
      <header className="donation-header">
        <div className="header-content">
          <h1>Ajude a Transformar Vidas</h1>
          <p>Sua contribuição faz a diferença!</p>
        </div>
      </header>

      {/* Formulário */}
      <section className="donation-form-section">
        <h2>Faça sua doação</h2>
        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              autoComplete="name"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              autoComplete="email"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="valor">Valor (R$)</label>
            <input 
              type="number" 
              id="valor" 
              name="valor" 
              min="1" 
              step="0.01" 
              autoComplete="transaction-amount"
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="metodo_pagamento">Método de Pagamento</label>
            <select 
              id="metodo_pagamento" 
              name="metodo_pagamento" 
              autoComplete="cc-type"
              required
            >
              <option value="">Selecione</option>
              <option value="pix">PIX</option>
              <option value="cartao">Cartão</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-donation"
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Confirmar Doação'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Monetary;