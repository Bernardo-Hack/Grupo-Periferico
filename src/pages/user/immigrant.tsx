import React from 'react';
import { Navbar } from '../../layouts/shared/navbar';
import { Footer } from '../../layouts/shared/footer'; 

const Immigrant: React.FC = () => {
  return (
    <div className="clothesfoods-page">
      <Navbar />

      <header className="donation-header" style={{ width: '100vw' }}>
        <div className="header-content">
          <h1>Apoio a Imigrantes</h1>
          <p>
            Estamos aqui para ajudar imigrantes a se integrarem e encontrarem suporte em nossa comunidade. Cadastre suas necessidades ou ofereça ajuda!
          </p>
        </div>
      </header>

      <section className="passport" style={{ width: '100vw', overflow: 'hidden', marginTop: '-50px' }}>
        <img
          src="src\assets\images\premium_photo-1682092342195-bdc0a848b7da.avif"
          alt="Passaporte brasileiro"
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
        />
      </section>

      <section className="donation-form-section">
        <h2>Precisa de Ajuda?</h2>
        <div className="form-info">
          <p>
            Preencha o formulário abaixo se você precisa de auxílio com moradia, alimentação, documentação ou outras necessidades.
          </p>
        </div>
        <form className="donation-form" id="immigrant-help-form">
          <label htmlFor="help-name">Nome completo</label>
          <input type="text" id="help-name" name="help-name" required />

          <label htmlFor="help-email">E-mail</label>
          <input type="email" id="help-email" name="help-email" required />

          <label htmlFor="help-need">Qual a sua necessidade?</label>
          <input
            type="text"
            id="help-need"
            name="help-need"
            placeholder="Ex: moradia, alimento, documentos"
            required
          />

          <label htmlFor="help-description">Descrição (opcional)</label>
          <textarea
            id="help-description"
            name="help-description"
            placeholder="Descreva melhor sua situação"
            rows={4}
          ></textarea>

          <button type="submit" className="submit-donation">
            Solicitar Apoio
          </button>
        </form>
      </section>

      {/* Seção para Voluntários */}
      <section className="donation-form-section alt-bg">
        <h2>Quer Oferecer Ajuda?</h2>
        <div className="form-info">
          <p>
            Se você deseja apoiar imigrantes com moradia, doações ou serviços, preencha o formulário abaixo.
          </p>
        </div>
        <form className="donation-form" id="volunteer-form">
          <label htmlFor="volunteer-name">Nome completo</label>
          <input type="text" id="volunteer-name" name="volunteer-name" required />

          <label htmlFor="volunteer-email">E-mail</label>
          <input type="email" id="volunteer-email" name="volunteer-email" required />

          <label htmlFor="volunteer-offer">Como você pode ajudar?</label>
          <input
            type="text"
            id="volunteer-offer"
            name="volunteer-offer"
            placeholder="Ex: hospedagem, alimentos, transporte"
            required
          />

          <label htmlFor="volunteer-details">Detalhes (opcional)</label>
          <textarea
            id="volunteer-details"
            name="volunteer-details"
            placeholder="Descreva como pretende ajudar"
            rows={4}
          ></textarea>

          <button type="submit" className="submit-donation">
            Oferecer Ajuda
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default Immigrant;