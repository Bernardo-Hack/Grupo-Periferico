// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Home from './pages/home';   
import Monetary from './pages/donations/monetary';
import Clothes from './pages/donations/clothes';
import Foods from './pages/donations/foods';
import UserRegister from './pages/user/user_register';
import Immigrant from './pages/user/immigrant';
import Voluntary from './pages/user/voluntary';
import Profile from './pages/user/profile';


function App() {
  return (
    <BrowserRouter>
      <div className="app-container">     
        <Routes>
          {/* Rota principal */}
          <Route path="/" element={<Home />} />

          {/* Páginas de perfil */}
          <Route path="/perfil" element={<Profile />} />  {/* Rota de Perfil */}

          {/* Páginas de registro */}
          <Route path="/registro" element={<UserRegister />} />  {/* Rota de Registro */}

          {/* Grupo de rotas de doações */}
          <Route path="/doacao-monetaria" element={<Monetary />} />
          <Route path="/doacao-roupas" element={<Clothes />} />
          <Route path="/doacao-alimentos" element={<Foods />} />

          {/* Páginas de apoio */}
          <Route path="/imigrantes" element={<Immigrant />} />  {/* Rota de Imigrantes */}
          <Route path="/voluntarios" element={<Voluntary />} />  {/* Rota de Voluntários */}

          {/* Rota fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
