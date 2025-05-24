import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/donations_global.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Monetary: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const validarEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const donationName = (document.getElementById('donationName') as HTMLInputElement)?.value;
    const donationEmail = (document.getElementById('donationEmail') as HTMLInputElement)?.value;
    const donationValue = (document.getElementById('donationValue') as HTMLInputElement)?.value;
    const donationPayment = (document.getElementById('donationPayment') as HTMLInputElement)?.value;

    if (!donationName || !donationEmail || !donationValue || !donationPayment) {
        return Swal.fire('Erro', 'Preencha todos os campos.', 'error');
      }

    if (!donationEmail || !validarEmail(donationEmail)) {
      return Swal.fire('Erro', 'Insira um e-mail válido.', 'error');
    }

    if (!donationValue) {
      return Swal.fire('Erro', 'Insira um valor.', 'error');
    }

    if (!donationPayment) {
      return Swal.fire('Erro', 'Selecione um método de pagamento.', 'error');
    }

    try {
      const res = await fetch('http://localhost:5000/api/doacoes/dinheiro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: donationName,
          email: donationEmail,
          valor: parseFloat(donationPayment),
          metodo_pagamento: donationValue
        }),
        credentials: 'include'
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Erro ao processar doação');
      }

      // Se a resposta incluir uma URL de redirecionamento
      if (json.redirectUrl) {
        window.location.href = json.redirectUrl;
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
            <label htmlFor="donationName">Nome Completo</label>
            <input 
              id="donationName"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="donationEmail">E-mail</label>
            <input id="donationEmail" autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="donationValue">Valor (R$)</label>
            <input 
              type="number" 
              id="donationValue" 
              name="valor"
              min="1" 
              step="0.01" 
              autoComplete="transaction-amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="donationPayment">Método de Pagamento</label>
            <select 
              id="donationPayment" 
              name="donationPayment"
              autoComplete="cc-type"
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