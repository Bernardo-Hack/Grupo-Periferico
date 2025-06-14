import React, { useEffect } from 'react';
import { initMDB, Tab, Input, Ripple } from 'mdb-ui-kit';
import { Navbar } from '../../layouts/shared/navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../layouts/style/user_registerCSS.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Login: React.FC = () => {
  useEffect(() => {
    try {
      initMDB({ Tab, Input, Ripple });
    } catch (error) {
      console.error('Erro ao inicializar o MDB UI Kit:', error);
    }
  }, []);

  const validarCPF = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(cpf);
  const validarTelefone = (telefone: string) => /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(telefone);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nome = (document.getElementById('loginName') as HTMLInputElement)?.value;
    const senha = (document.getElementById('loginPassword') as HTMLInputElement)?.value;

    if (!nome || !senha) {
      return Swal.fire('Erro', 'Preencha nome e senha.', 'error');
    }

    const res = await fetch('http://localhost:5000/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome, senha }),
    });

    const json = await res.json();
    if (json.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Login bem-sucedido!',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = '/perfil';
      });
    } else {
      Swal.fire('Erro', json.error || 'Nome ou senha inválidos.', 'error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const nome = (document.getElementById('registerName') as HTMLInputElement)?.value;
    const cpf = (document.getElementById('registerCpf') as HTMLInputElement)?.value;
    const telefone = (document.getElementById('registerTelefone') as HTMLInputElement)?.value;
    const dt_nasc = (document.getElementById('registerNascimento') as HTMLInputElement)?.value;
    const senha = (document.getElementById('registerPassword') as HTMLInputElement)?.value;

    if (!nome || !cpf || !telefone || !dt_nasc || !senha) {
      return Swal.fire('Erro', 'Preencha todos os campos.', 'error');
    }

    if (!validarCPF(cpf)) {
      return Swal.fire('Erro', 'CPF inválido.', 'error');
    }

    if (!validarTelefone(telefone)) {
      return Swal.fire('Erro', 'Telefone inválido.', 'error');
    }

    const res = await fetch('http://localhost:5000/user/reg_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nome, cpf, telefone, dt_nasc, senha }),
    });

    const json = await res.json();
    if (json.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Usuário cadastrado com sucesso!',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire('Erro', json.error || 'Erro ao cadastrar.', 'error');
    }
  };

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
            {/* Aba de login */}
            <div
              className="tab-pane fade show active"
              id="pills-login"
              role="tabpanel"
              aria-labelledby="tab-login"
            >
              <form onSubmit={handleLogin}>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="text" id="loginName" className="form-control" />
                  <label className="form-label" htmlFor="loginName">Nome de usuário</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="password" id="loginPassword" className="form-control" />
                  <label className="form-label" htmlFor="loginPassword">Senha</label>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6 d-flex justify-content-center">
                    <div className="form-check mb-3 mb-md-0">
                      <input className="form-check-input" type="checkbox" value="" id="loginCheck" defaultChecked />
                      <label className="form-check-label" htmlFor="loginCheck">Lembrar de mim</label>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex justify-content-center">
                    <a href="#!">Esqueceu a senha?</a>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-4">Entrar</button>

              </form>
            </div>

            {/* Aba de cadastro */}
            <div
              className="tab-pane fade"
              id="pills-register"
              role="tabpanel"
              aria-labelledby="tab-register"
            >
              <form className="register-form" onSubmit={handleRegister}>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="text" id="registerName" className="form-control" />
                  <label className="form-label" htmlFor="registerName">Nome completo</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="text" id="registerCpf" className="form-control" />
                  <label className="form-label" htmlFor="registerCpf">CPF</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="text" id="registerTelefone" className="form-control" />
                  <label className="form-label" htmlFor="registerTelefone">Telefone</label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="date"
                    id="registerNascimento"
                    className="form-control active"
                    placeholder=" "
                  />
                  <label className="form-label" htmlFor="registerNascimento">Data de nascimento</label>
                </div>

                <div data-mdb-input-init className="form-outline mb-4">
                  <input type="password" id="registerPassword" className="form-control" />
                  <label className="form-label" htmlFor="registerPassword">Senha</label>
                </div>

                <div className="form-check d-flex justify-content-center mb-4">
                  <input className="form-check-input me-2" type="checkbox" value="" id="registerCheck" defaultChecked />
                  <label className="form-check-label" htmlFor="registerCheck">Eu li e concordo com os termos</label>
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-3">Cadastrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
