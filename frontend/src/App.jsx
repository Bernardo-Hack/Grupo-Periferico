// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Home from './pages/home';   
import Profile from './pages/user/profile';
import UserRegister from './pages/user/user_register';
import Monetary from './pages/donations/monetary';
import Clothes from './pages/donations/clothes';
import Foods from './pages/donations/foods';
import Immigrant from './pages/user/immigrant';  
import Voluntary from './pages/user/voluntary';  

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">     
        <Routes>
          {/* Rota principal */}
          <Route path="/" element={<Home />} />
          
          {/* Autenticação */}
          <Route path="/login" element={<Login />} />
          
          {/* Páginas de perfil */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/registro-usuario" element={<UserRegister />} />
          
          {/* Páginas de doação */}
          <Route path="/doacao-monetaria" element={<Monetary />} />
          <Route path="/doacao-roupas" element={<Clothes />} />
          <Route path="/doacao-alimentos" element={<Foods />} />
          
          {/* Páginas de apoio */}
          <Route path="/apoio-imigrantes" element={<Immigrant />} />
          <Route path="/seja-voluntario" element={<Voluntary />} />
          
          {/* Rota fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;