import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';
import '../../layouts/style/donations_global.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const Foods: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const validarEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const donationName = (document.getElementById('donationName') as HTMLInputElement)?.value;
    const donationEmail = (document.getElementById('donationEmail') as HTMLInputElement)?.value;
    const donationType = (document.getElementById('donationType') as HTMLInputElement)?.value;
    const donationQuantity = (document.getElementById('donationQauntity') as HTMLInputElement)?.value;

    if (!donationName || !donationEmail || !donationType || !donationQuantity) {
      return Swal.fire('Erro', 'Preencha todos os campos.', 'error');
    }

    if (!donationName) {
      return Swal.fire('Erro', 'Insira um nome.', 'error');
    }

    if (!donationEmail || !validarEmail(donationEmail)) {
      return Swal.fire('Erro', 'Insira um e-mail válido.', 'error');
    }

    if (!donationType) {
      return Swal.fire('Erro', 'Insira um alimento válido.', 'error');
    }

    if (!donationQuantity) {
      return Swal.fire('Erro', 'Insira uma quantidade válida.', 'error');
    }

    try {
      const res = await fetch('http://localhost:5000/api/doacoes/alimentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: donationName,
          email: donationEmail,
          quantidade: donationQuantity,
          tipo: donationType
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
            <label htmlFor="tipo">Tipo de Alimento</label>
            <input
              id="donationType"
              name="donationType"
              placeholder="Ex: Arroz, Feijão"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade (kg)</label>
            <input
              type="number"
              id="donationQuantity"
              name="donationQuantity"
              min="0.1"
              step="0.1"
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