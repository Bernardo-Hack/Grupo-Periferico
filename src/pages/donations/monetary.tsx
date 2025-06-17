import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { useTheme } from '../../contexts/ThemeContext';
import apiClient from '../../api'; // 👈 1. Importar
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../../layouts/style/donations_global.css';

const Monetary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme(); // Obtenha o tema atual

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [valor, setValor] = useState<string>(''); // string para input, converteremos antes de enviar
  const [metodoPagamento, setMetodoPagamento] = useState('');

  const validarEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Converter valor para número
    const valorNum = parseFloat(valor);
    console.log('Monetary - Valores enviados:', { nome, email, valor, valorNum, metodoPagamento });

    // Validações básicas
    if (!nome || !email || !valor || !metodoPagamento) {
      return Swal.fire('Erro', 'Preencha todos os campos.', 'error');
    }
    if (!validarEmail(email)) {
      return Swal.fire('Erro', 'Insira um e-mail válido.', 'error');
    }
    if (isNaN(valorNum)) {
      return Swal.fire('Erro', 'Valor inválido.', 'error');
    }
    if (valorNum <= 0) {
      return Swal.fire('Erro', 'Valor deve ser maior que zero.', 'error');
    }
    // opcional: verificar se metodoPagamento está entre as opções esperadas
    const opcoes = ['pix', 'cartao', 'boleto'];
    if (!opcoes.includes(metodoPagamento)) {
      return Swal.fire('Erro', 'Método de pagamento inválido.', 'error');
    }

    setLoading(true);
    try {
      // 👇 2. Usar apiClient em vez de fetch
      const response = await apiClient.post('/api/doacoes/dinheiro', {
        nome,
        email,
        valor: valorNum,
        metodo_pagamento: metodoPagamento,
      });

      const json = response.data;

      if (json.redirectUrl) {
        window.location.href = json.redirectUrl;
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Doação realizada com sucesso!',
          text: 'Obrigado por sua contribuição!',
          timer: 3000,
          willClose: () => {
            window.location.href = '/doacao/sucesso';
          }
        });
      }
    } catch (err: any) {
      console.error('Erro na doação (frontend):', err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.response?.data?.message || 'Ocorreu um erro inesperado.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monetary-page" data-theme={theme}>
      <Navbar />

      <header className="donation-header">
        <div className="header-content">
          <h1>Ajude a Transformar Vidas</h1>
          <p>Sua contribuição faz a diferença!</p>
        </div>
      </header>
      <section className="donation-banner">
        <img
          src="src\assets\images\photo-1740592910131-b604d790061a.avif"
          alt="Doação de Alimentos"
        />
      </section>

      <section className="donation-form-section">
        <h2>Faça sua doação</h2>
        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="donationName">Nome Completo</label>
            <input
              type="text"
              id="donationName"
              name="donationName"
              autoComplete="name"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="donationEmail">E-mail</label>
            <input
              type="email"
              id="donationEmail"
              name="donationEmail"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              value={valor}
              onChange={e => setValor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="donationPayment">Método de Pagamento</label>
            <select
              id="donationPayment"
              name="donationPayment"
              autoComplete="cc-type"
              value={metodoPagamento}
              onChange={e => setMetodoPagamento(e.target.value)}
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
