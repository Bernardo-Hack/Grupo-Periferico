// src/pages/adm/adminLogin.tsx
import React, { useEffect } from 'react';
import { initMDB, Input, Ripple } from 'mdb-ui-kit';
import { Navbar } from '../../layouts/shared/navbar';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../../layouts/style/user_registerCSS.css';

const AdminLogin: React.FC = () => {
  useEffect(() => {
    document.title = 'Login do Administrador';
    try {
      initMDB({ Input, Ripple });
    } catch (err) {
      console.error('Erro ao inicializar o MDB UI Kit:', err);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = (document.getElementById('adminId') as HTMLInputElement)?.value;
    const senha = (document.getElementById('adminSenha') as HTMLInputElement)?.value;

    if (!id || !senha) {
      return Swal.fire('Erro', 'Preencha ID e senha.', 'error');
    }

    const res = await fetch('http://localhost:5000/adm/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, senha }),
    });

    const json = await res.json();
    if (json.ok) {
      Swal.fire({
        icon: 'success',
        title: `Bem-vindo, ${json.nome}!`,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = '/admin';
      });
    } else {
      Swal.fire('Erro', json.error || 'ID ou senha inválidos.', 'error');
    }
  };

  return (
    <div className="login-page-wrapper d-flex flex-column min-vh-100">
      <Navbar />
      <div className="d-flex flex-grow-1 align-items-center justify-content-center">
        <div className="login-register-container" style={{ maxWidth: 400, width: '100%' }}>
          <h3 className="text-center mb-4">Login do Administrador</h3>
          <form onSubmit={handleLogin}>
            <div data-mdb-input-init className="form-outline mb-4">
              <input type="number" id="adminId" className="form-control" />
              <label className="form-label" htmlFor="adminId">ID do Administrador</label>
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
              <input type="password" id="adminSenha" className="form-control" />
              <label className="form-label" htmlFor="adminSenha">Senha</label>
            </div>

            <button type="submit" className="btn btn-danger w-100">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
