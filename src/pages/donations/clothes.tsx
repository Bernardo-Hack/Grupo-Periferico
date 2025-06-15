import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/donations_global.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useTheme } from '../../contexts/ThemeContext';

const Clothes: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme(); // Obtenha o tema atual

  const validarEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const donationName = (document.getElementById('donationName') as HTMLInputElement)?.value;
    const donationEmail = (document.getElementById('donationEmail') as HTMLInputElement)?.value;
    const donationType = (document.getElementById('donationType') as HTMLInputElement)?.value;
    const donationQuantity = (document.getElementById('donationQuantity') as HTMLInputElement)?.value;
    const donationSize = (document.getElementById('donationSize') as HTMLInputElement)?.value;

    if (!donationName || !donationEmail || !donationType || !donationQuantity || !donationSize) {
      return Swal.fire('Erro', 'Preencha todos os campos.', 'error');
    }

    if (!donationName) {
      return Swal.fire('Erro', 'Insira um nome.', 'error');
    }

    if (!donationEmail || !validarEmail(donationEmail)) {
      return Swal.fire('Erro', 'Insira um e-mail válido.', 'error');
    }

    if (!donationType) {
      return Swal.fire('Erro', 'Insira um tipo de roupa válida.', 'error');
    }

    if (!donationQuantity) {
      return Swal.fire('Erro', 'Insira uma quantidade válida.', 'error');
    }

    if (!donationSize) {
      return Swal.fire('Erro', 'Insira um tamanho válido.', 'error');
    }

    try {
      const res = await fetch('http://localhost:5000/api/doacoes/roupas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: donationName,
          email: donationEmail,
          quantidade: donationQuantity,
          tipo: donationType,
          tamanho: donationSize
        }),
        credentials: 'include'
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Erro ao processar doação');
      }

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

        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="donationName"
              name="donationName"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="donationEmail"
              name="donationEmail"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Roupa</label>
            <input
              id="donationType"
              name="donationType"
              placeholder="Ex: Camisetas, Calças"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantidade">Quantidade</label>
              <input
                type="number"
                id="donationQuantity"
                name="donationQuantity"
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tamanho">Tamanho</label>
              <select
                id="donationSize"
                name="donationSize"
              >
                <option value="">Selecione</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
              </select>
            </div>
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
            ) : 'Doar Roupas'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Clothes;