import { Navbar } from '../layouts/shared/navbar';
import { Footer } from '../layouts/shared/footer';
import { useNavigate } from 'react-router-dom';
import '../layouts/style/globalCSS.css';
import '../layouts/style/homeCSS.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />

      {/* Seção Hero Banner */}
      <section className="home-hero">
        <div className="hero-overlay">
          <img 
            className="hero-image" 
            src="\src\assets\images\cropped_grupo.png" 
            alt="Grupo Periférico" 
          />
          <h1>Bem-vindo ao Grupo Periférico</h1>
          <p>A luta por um mundo mais justo e inclusivo começa aqui.</p>
        </div>
      </section>

      {/* Seção Sobre Nós */}
      <section id="sobre-nos" className="home-section alt-bg">
        <div className="section-content styled-section reversed">
          <img 
            className="section-image" 
            src="src\assets\images\istockphoto-2171791904-612x612.jpg" 
            alt="Sobre Nós" 
          />
          <div className="text-block">
            <h2>Quem Somos</h2>
            <p>
              O Grupo Periférico é uma ONG que atua diretamente nas comunidades mais vulneráveis, 
              oferecendo apoio e criando oportunidades de transformação social por meio da 
              solidariedade e do engajamento coletivo.
            </p>
            <p>
              Atuamos com doações, acolhimento de imigrantes e promoção da cidadania, sempre 
              respeitando as diversidades e lutando por justiça social.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Doação Monetária */}
      <section id="doacao-monetaria" className="home-section">
        <div className="section-content styled-section">
          <img 
            className="section-image" 
            src="src/assets/images/istockphoto-2171792105-612x612.jpg" 
            alt="Doação Monetária" 
          />
          <div className="text-block">
            <h2>Doações Monetárias</h2>
            <p>Sua contribuição financeira é essencial para manter nossos projetos e ações sociais.</p>
            <button 
              className="section-cta"
              onClick={() => navigate('/doacao-monetaria')}
            >
              Doar Agora
            </button>
          </div>
        </div>
      </section>

      {/* Seção Doação de Roupas */}
      <section id="doacao-roupas" className="home-section alt-bg">
        <div className="section-content styled-section reversed">
          <img 
            className="section-image" 
            src="src/assets/images/istockphoto-2171792150-612x612.jpg" 
            alt="Doação de Roupas" 
          />
          <div className="text-block">
            <h2>Doações de Roupas</h2>
            <p>Contribua com roupas em bom estado para ajudar comunidades necessitadas.</p>
            <button 
              className="section-cta"
              onClick={() => navigate('/doacao-roupas')}
            >
              Doar Roupas
            </button>
          </div>
        </div>
      </section>

      {/* Seção Doação de Alimentos */}
      <section id="doacao-alimentos" className="home-section">
        <div className="section-content styled-section">
          <img 
            className="section-image" 
            src="src\assets\images\istockphoto-2171791540-612x612.jpg" 
            alt="Doação de Alimentos" 
          />
          <div className="text-block">
            <h2>Doações de Alimentos</h2>
            <p>Sua contribuição com alimentos não perecíveis faz a diferença.</p>
            <button 
              className="section-cta"
              onClick={() => navigate('/doacao-alimentos')}
            >
              Doar Alimentos
            </button>
          </div>
        </div>
      </section>

      {/* Seção Apoio a Imigrantes */}
      <section id="apoio-imigrantes" className="home-section alt-bg">
        <div className="section-content styled-section reversed">
          <img 
            className="section-image" 
            src="src/assets/images/photo-1488521787991-ed7bbaae773c.avif" 
            alt="Apoio a Imigrantes" 
          />
          <div className="text-block">
            <h2>Apoio a Imigrantes</h2>
            <p>Oferecemos suporte para imigrantes conquistarem a cidadania e se integrarem à sociedade.</p>
            <button 
              className="section-cta"
              onClick={() => navigate('/imigrantes')}
            >
              Ver Suporte
            </button>
          </div>
        </div>
      </section>

      {/* Seção Voluntariado */}
      <section id="voluntariado" className="home-section">
        <div className="section-content styled-section">
          <img 
            className="section-image" 
            src="src/assets/images/istockphoto-2171791845-612x612.jpg" 
            alt="Voluntariado" 
          />
          <div className="text-block">
            <h2>Seja um Voluntário</h2>
            <p>Participe ativamente de nossas ações e ajude a transformar vidas.</p>
            <button 
              className="section-cta"
              onClick={() => navigate('/voluntarios')}
            >
              Inscreva-se
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
