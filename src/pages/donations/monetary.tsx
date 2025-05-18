import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/donations_global.css';
import Swal from 'sweetalert2';

const Monetary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    valor: '',
    metodo_pagamento: '',
    nome: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, insira seu nome completo',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, insira um e-mail válido',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, insira um valor válido',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
    if (!formData.metodo_pagamento) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, selecione um método de pagamento',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/doacoes/dinheiro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: parseFloat(formData.valor),
          metodo_pagamento: formData.metodo_pagamento,
          nome: formData.nome,
          email: formData.email
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar doação');
      }

      // Se a resposta incluir uma URL de redirecionamento
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Doação realizada com sucesso!',
          text: 'Obrigado por sua contribuição!',
          confirmButtonColor: '#3085d6',
          timer: 3000,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = '/doacao/sucesso';
          }
        });
      }
      
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.message || 'Ocorreu um erro inesperado ao processar sua doação',
        confirmButtonColor: '#3085d6'
      });
      console.error('Erro na doação:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monetary-page">
      <Navbar />

      <header className="donation-header">
        <div className="header-content">
          <h1>Ajude a Transformar Vidas</h1>
          <p>Sua contribuição faz a diferença!</p>
        </div>
      </header>

      <section className="donation-form-section">
        <h2>Faça sua doação</h2>
        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              value={formData.nome}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.valor}
              onChange={handleChange}
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
              value={formData.metodo_pagamento}
              onChange={handleChange}
              autoComplete="cc-type"
              required
            >
              <option value="">Selecione</option>
              <option value="pix">PIX</option>
              <option value="cartao">Cartão de Crédito</option>
              <option value="boleto">Boleto Bancário</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="submit-donation"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processando...
              </>
            ) : 'Confirmar Doação'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Monetary;