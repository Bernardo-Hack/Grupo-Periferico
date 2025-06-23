import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';
import '../../layouts/style/voluntaryCSS.css';
import Swal from 'sweetalert2';

const Voluntary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.VITE_API_URL;
  const token = localStorage.getItem('jwtToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const voluntaryName = (document.getElementById('name') as HTMLInputElement)?.value;
    const voluntaryEmail = (document.getElementById('email') as HTMLInputElement)?.value;
    const voluntaryAge = (document.getElementById('age') as HTMLInputElement)?.value;
    const voluntaryAviability = (document.getElementById('disponibilidade') as HTMLInputElement)?.value;
    const voluntaryExperience = (document.getElementById('experiencia') as HTMLInputElement)?.value;

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/registrar-voluntario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Formato padrão
        },
        body: JSON.stringify({
          nome: voluntaryName,
          email: voluntaryEmail,
          quantidade: voluntaryAge,
          tipo: voluntaryAviability,
          tamanho: voluntaryExperience
        })
      });

      const json = await res.json();
      console.log('Resposta da API:', json);

      if (res.status === 400 || res.status === 401) {
        throw new Error(json.message || 'Erro ao processar cadastro de voluntário');
      }

      if (res.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          text: 'Obrigado por sua contribuição!',
          confirmButtonColor: '#3085d6',
          timer: 1500,
          timerProgressBar: true,
          willClose: () => {
            window.location.href = '/voluntario/sucesso';
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
    <div className="monetary-page">
      <Navbar />
      {/* ... restante do código ... */}
      <form className="donation-form voluntary-form" onSubmit={handleSubmit}>
        <h3>Preencha seus dados para participar</h3>
        <label htmlFor="nome">Nome Completo</label>
        <input type="text" id="nome" required />
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" required />
        <label htmlFor="idade">Idade</label>
        <input type="number" id="idade" required />
        <label htmlFor="disponibilidade">Disponibilidade</label>
        <select id="disponibilidade" required>
          <option value="">Selecione</option>
          <option value="semanal">Algumas horas por semana</option>
          <option value="eventos">Apenas para eventos específicos</option>
          <option value="integral">Tempo integral</option>
        </select>
        <label htmlFor="experiencia">Experiência Anterior (opcional)</label>
        <textarea id="experiencia" rows={3}></textarea>
        <button type="submit" className="submit-donation">
          Tornar-se Voluntário
        </button>
        {loading ? (
          <>
            <span className="spinner"></span>
            Enviando...
          </>
        ) : 'Voluntáriar-se'}
      </form>
      <Footer />
    </div>
  );
};

export default Voluntary;
