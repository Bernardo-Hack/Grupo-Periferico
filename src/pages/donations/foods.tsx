import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';
import { useTheme } from '../../contexts/ThemeContext'; 
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../../layouts/style/donations_global.css';

const Foods: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme(); // Obtenha o tema atual
  const apiUrl = process.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');

  const validarEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantidadeNum = parseFloat(quantidade);
    console.log('Valores enviados:', { nome, email, tipo, quantidade, quantidadeNum });

    if (!nome || !email || !tipo || !quantidade) {
      return Swal.fire('Erro', 'Preencha todos os campos.', 'error');
    }
    if (!validarEmail(email)) {
      return Swal.fire('Erro', 'Insira um e-mail válido.', 'error');
    }
    if (isNaN(quantidadeNum)) {
      return Swal.fire('Erro', 'Quantidade inválida.', 'error');
    }
    if (quantidadeNum <= 0) {
      return Swal.fire('Erro', 'Quantidade deve ser maior que zero.', 'error');
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/doacoes/roupa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Formato padrão
        },
        body: JSON.stringify({
          nome,
          email,
          tipo,
          quantidade: quantidadeNum,
        }),
      });

      const json = await res.json();
      console.log('Resposta da API:', json);

      if (res.status === 400 || res.status === 401) {
        throw new Error(json.message || 'Erro ao processar doação');
      }

      if (res.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Doação realizada com sucesso!',
          text: 'Obrigado por sua contribuição!',
          confirmButtonColor: '#3085d6',
          timer: 1500,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = '/doacao/sucesso';
          }
        });
      }
    } catch (err) {
      console.error('Erro na doação (frontend):', err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err instanceof Error ? err.message : 'Ocorreu um erro inesperado ao processar sua doação',
        confirmButtonColor: '#3085d6'
      });
      console.error('Erro na doação:', err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clothesfoods-page" data-theme={theme}>
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

      <section className="donation-info">
        <div className="info-item">
          <i className="fas fa-apple-alt icon"></i>
          <h3>Alimentos que Alimentam</h3>
          <p>Cada doação garante refeições mais dignas a famílias inteiras.</p>
        </div>
        <div className="info-item">
          <i className="fas fa-seedling icon"></i>
          <h3>Apoio Sustentável</h3>
          <p>Doações são organizadas para distribuição responsável e eficiente.</p>
        </div>
        <div className="info-item">
          <i className="fas fa-users icon"></i>
          <h3>Comunidade Mais Forte</h3>
          <p>Alimentar é também cuidar, fortalecer laços e transformar realidades.</p>
        </div>
      </section>

      <section className="donation-form-section">
        <div className="form-info">
          <p>Preencha os dados abaixo para doar alimentos:</p>
        </div>

        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="donationName">Nome Completo</label>
            <input
              type="text"
              id="donationName"
              name="donationName"
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
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="donationType">Tipo de Alimento</label>
            <input
              type="text"
              id="donationType"
              name="donationType"
              placeholder="Ex: Arroz, Feijão"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="donationQuantity">Quantidade (kg)</label>
            <input
              type="number"
              id="donationQuantity"
              name="donationQuantity"
              min="0.1"
              step="0.1"
              value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="submit-donation"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Enviando...
              </>
            ) : 'Doar Alimentos'}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Foods;