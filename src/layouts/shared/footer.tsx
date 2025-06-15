export const Footer = () => {
  return (
    <footer className="footer styled-footer bg-dark text-white py-4">
      <div className="footer-container">
        <div className="row">
          {/* Sobre Nós */}
          <div className="col-md-6 mb-3">
            <h2 className="h5">Sobre Nós</h2>
            <p>
              Somos uma ONG comprometida com a transformação social, mobilizando recursos e pessoas para fazer a diferença.
            </p>
          </div>

          {/* Contato */}
          <div className="col-md-6">
            <h2 className="h5">Contato</h2>
            <p>Email: <a href="mailto:contato@grupoperiferico.org.br" className="text-white">contato@grupoperiferico.org.br</a></p>
            <p>Telefone: <a href="tel:+551112345678" className="text-white">(11) 1234-5678</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
};