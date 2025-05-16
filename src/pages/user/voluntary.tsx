import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';

const Voluntary: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    disponibilidade: '',
    experiencia: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('http://localhost:5000/voluntario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          alert('Cadastro de voluntário realizado com sucesso!');
        } else {
          alert('Erro ao cadastrar voluntário.');
        }
      })
      .catch(err => console.error('Erro ao enviar dados:', err));
  };

  return (
    <div className="monetary-page">
      <Navbar />
      {/* ... restante do código ... */}
      <form className="donation-form voluntary-form" onSubmit={handleSubmit}>
        <h3>Preencha seus dados para participar</h3>
        <label htmlFor="nome">Nome Completo</label>
        <input type="text" id="nome" value={formData.nome} onChange={handleChange} required />
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" value={formData.email} onChange={handleChange} required />
        <label htmlFor="disponibilidade">Disponibilidade</label>
        <select id="disponibilidade" value={formData.disponibilidade} onChange={handleChange} required>
          <option value="">Selecione</option>
          <option value="semanal">Algumas horas por semana</option>
          <option value="eventos">Apenas para eventos específicos</option>
          <option value="integral">Tempo integral</option>
        </select>
        <label htmlFor="experiencia">Experiência Anterior (opcional)</label>
        <textarea id="experiencia" rows={3} value={formData.experiencia} onChange={handleChange}></textarea>
        <button type="submit" className="submit-donation">
          Tornar-se Voluntário
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default Voluntary;
