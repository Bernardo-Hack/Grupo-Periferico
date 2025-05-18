import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import '../../layouts/style/donations_global.css';
import Swal from 'sweetalert2';

interface ClothesDonationForm {
  nome: string;
  email: string;
  tipo: string;
  quantidade: number;
  tamanho: string;
}

const Clothes: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClothesDonationForm>({
    nome: '',
    email: '',
    tipo: '',
    quantidade: 1,
    tamanho: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade' ? parseInt(value) || 0 : value
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
        text: 'Por favor, informe o tipo de roupa',
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
      const response = await fetch('http://localhost:5000/api/doacoes/roupas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          tipo: formData.tipo,
          quantidade: formData.quantidade,
          tamanho: formData.tamanho
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao processar doação de roupas');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Doação registrada com sucesso!',
        text: 'Obrigado por contribuir com roupas para quem precisa!',
        confirmButtonColor: '#3085d6'
      });

      // Resetar formulário após sucesso
      setFormData({
        nome: '',
        email: '',
        tipo: '',
        quantidade: 1,
        tamanho: ''
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
            <label htmlFor="tipo">Tipo de Roupa</label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              placeholder="Ex: Camisetas, Calças"
              value={formData.tipo}
              onChange={handleChange}
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
                value={formData.quantidade}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="tamanho">Tamanho</label>
              <select 
                id="tamanho" 
                name="tamanho"
                value={formData.tamanho}
                onChange={handleChange}
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