import React, { useState } from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer';
import '../../layouts/style/voluntaryCSS.css';
import Swal from 'sweetalert2';

const Voluntary: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submittedBloodType, setSubmittedBloodType] = useState<string | null>(null);

  const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('jwtToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const voluntaryName = (document.getElementById('nome') as HTMLInputElement)?.value;
    const voluntaryEmail = (document.getElementById('email') as HTMLInputElement)?.value;
    const voluntaryAviability = (document.getElementById('disponibilidade') as HTMLSelectElement)?.value;
    const voluntaryExperience = (document.getElementById('experiencia') as HTMLTextAreaElement)?.value;
    const voluntaryBloodType = (document.getElementById('tipo_sanguineo') as HTMLSelectElement)?.value;

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/registrar-voluntario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: voluntaryName,
          email: voluntaryEmail,
          disponibilidade: voluntaryAviability,
          experiencia: voluntaryExperience,
          tipo_sanguineo: voluntaryBloodType,
        }),
      });

      const json = await res.json();
      console.log('Resposta da API:', json);

      if (!res.ok) {
        throw new Error(json.message || 'Erro ao processar cadastro de voluntário');
      }

      setSubmittedBloodType(voluntaryBloodType);

      await Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        text: 'Obrigado por sua contribuição!',
        confirmButtonColor: '#3085d6',
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err) {
      console.error('Erro no cadastro (frontend):', err);
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text:
          err instanceof Error
            ? err.message
            : 'Ocorreu um erro inesperado ao cadastrar o voluntário.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monetary-page">
      <Navbar />
      <form className="donation-form voluntary-form" onSubmit={handleSubmit}>
        <h3>Preencha seus dados para participar</h3>

        <label htmlFor="nome">Nome Completo</label>
        <input type="text" id="nome" required />

        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" required />

        <label htmlFor="disponibilidade">Disponibilidade</label>
        <select id="disponibilidade" required>
          <option value="">Selecione</option>
          <option value="semanal">Algumas horas por semana</option>
          <option value="eventos">Apenas para eventos específicos</option>
          <option value="integral">Tempo integral</option>
        </select>

        <label htmlFor="tipo_sanguineo">Tipo Sanguíneo</label>
        <select id="tipo_sanguineo" required>
          <option value="">Selecione</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label htmlFor="experiencia">Experiência Anterior (opcional)</label>
        <textarea id="experiencia" rows={3}></textarea>

        <button type="submit" className="submit-donation">
          {loading ? (
            <>
              <span className="spinner"></span> Enviando...
            </>
          ) : (
            'Tornar-se Voluntário'
          )}
        </button>

        {submittedBloodType && (
          <p style={{ marginTop: '15px', color: 'green' }}>
            Seu tipo sanguíneo cadastrado: <strong>{submittedBloodType}</strong>
          </p>
        )}
      </form>
      <Footer />
    </div>
  );
};

export default Voluntary;
