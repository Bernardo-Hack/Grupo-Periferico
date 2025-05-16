import React, { useEffect } from 'react';
import { initMDB, Tab, Input, Ripple } from 'mdb-ui-kit';
import { Navbar } from '../../layouts/shared/navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../layouts/style/user_registerCSS.css';

const Login: React.FC = () => {
    useEffect(() => {
        try {
            initMDB({ Tab, Input, Ripple });
        } catch (error) {
            console.error('Erro ao inicializar o MDB UI Kit:', error);
        }
    }, []);
    return (
<div className="login-page-wrapper d-flex flex-column min-vh-100">
   <Navbar />
  <div className="d-flex flex-grow-1 align-items-center justify-content-center">
    <div className="login-register-container">
      {/* Abas de navegação */}
      <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link active"
            id="tab-login"
            data-mdb-pill-init
            href="#pills-login"
            role="tab"
            aria-controls="pills-login"
            aria-selected="true"
          >
            Login
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            id="tab-register"
            data-mdb-pill-init
            href="#pills-register"
            role="tab"
            aria-controls="pills-register"
            aria-selected="false"
          >
            Cadastro
          </a>
        </li>
      </ul>

      {/* Conteúdo das abas */}
      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="pills-login"
          role="tabpanel"
          aria-labelledby="tab-login"
        >
          <form>
            {/* Campo de email */}
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="email" id="loginName" className="form-control" />
              <label className="form-label" htmlFor="loginName">
                Email ou nome de usuário
              </label>
            </div>
            
            {/* Campo de senha */}
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="password" id="loginPassword" className="form-control" />
              <label className="form-label" htmlFor="loginPassword">
                Senha
              </label>
            </div>
            
            {/* Checkbox e link */}
            <div className="row mb-4">
              <div className="col-md-6 d-flex justify-content-center">
                <div className="form-check mb-3 mb-md-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="loginCheck"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="loginCheck">
                    Lembrar de mim
                  </label>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-center">
                <a href="#!">Esqueceu a senha?</a>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block mb-4">
              Entrar
            </button>
            
            <div className="text-center">
              <p>
                Não é membro? <a href="#!">Cadastre-se</a>
              </p>
            </div>
          </form>
        </div>
        
        {/* Aba de cadastro */}
        <div
          className="tab-pane fade"
          id="pills-register"
          role="tabpanel"
          aria-labelledby="tab-register"
        >
          <form
            className="register-form"
            onSubmit={async (e) => {
              e.preventDefault();

              const nome = (document.getElementById('registerName') as HTMLInputElement)?.value;
              const cpf = (document.getElementById('registerCpf') as HTMLInputElement)?.value;
              const telefone = (document.getElementById('registerTelefone') as HTMLInputElement)?.value;
              const dt_nasc = (document.getElementById('registerNascimento') as HTMLInputElement)?.value;
              const senha = (document.getElementById('registerPassword') as HTMLInputElement)?.value;

              const res = await fetch('http://localhost:5000/user/reg_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ nome, cpf, telefone, dt_nasc, senha }),
              });

              const json = await res.json();
              if (json.ok) {
                alert('Usuário cadastrado com sucesso!');
              } else {
                alert('Erro: ' + json.error);
              }
            }}
          >
            {/* Campo de nome */}
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="text" id="registerName" className="form-control" />
              <label className="form-label" htmlFor="registerName">Nome completo</label>
            </div>

            {/* Campo de CPF */}
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="text" id="registerCpf" className="form-control" />
              <label className="form-label" htmlFor="registerCpf">CPF</label>
            </div>

            {/* Campo de telefone */}
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="text" id="registerTelefone" className="form-control" />
              <label className="form-label" htmlFor="registerTelefone">Telefone</label>
            </div>

            {/* Campo de data de nascimento */}
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="date" id="registerNascimento" className="form-control" />
              <label className="form-label" htmlFor="registerNascimento">Data de nascimento</label>
            </div>

            {/* Campo de senha */}
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="password" id="registerPassword" className="form-control" />
              <label className="form-label" htmlFor="registerPassword">Senha</label>
            </div>

            {/* Checkbox de termos */}
            <div className="form-check d-flex justify-content-center mb-4">
              <input
                className="form-check-input me-2"
                type="checkbox"
                value=""
                id="registerCheck"
                defaultChecked
                aria-describedby="registerCheckHelpText"
              />
              <label className="form-check-label" htmlFor="registerCheck">
                Eu li e concordo com os termos
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block mb-3">
              Cadastrar
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>
</div>
    );
};

export default Login;