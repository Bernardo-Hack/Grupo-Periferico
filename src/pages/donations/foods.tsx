// src/frontend/pages/donations/Foods.tsx
import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';
import '../../layouts/style/donations_global.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface FoodDonationForm {
  nome: string;
  email: string;
  tipo: string;
  quantidade: number;
}

const Foods: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FoodDonationForm>({
    nome: '',
    email: '',
    tipo: '',
    quantidade: 0.1
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' ? parseFloat(value) || 0 : value
    }));
  };

  const validateForm = (): boolean => {
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

    if (!formData.tipo.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, informe o tipo de alimento',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    if (formData.quantidade <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Por favor, insira uma quantidade válida',
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
      const response = await fetch('http://localhost:5000/api/doacoes/alimentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          tipo: formData.tipo,
          quantidade: formData.quantidade
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar doação de alimentos');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Doação registrada com sucesso!',
        text: 'Obrigado por contribuir com alimentos para quem precisa!',
        confirmButtonColor: '#3085d6'
      });

      // Resetar formulário após sucesso
      setFormData({
        nome: '',
        email: '',
        tipo: '',
        quantidade: 0.1
      });

    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: err.message || 'Ocorreu um erro ao enviar sua doação',
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
              type="text" 
              id="nome" 
              name="nome" 
              value={formData.nome}
              onChange={handleChange}
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
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Alimento</label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              placeholder="Ex: Arroz, Feijão"
              value={formData.tipo}
              onChange={handleChange}
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
              value={formData.quantidade}
              onChange={handleChange}
              required
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