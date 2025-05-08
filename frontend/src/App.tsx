// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Home from './pages/home';   
//import Profile from './pages/user/profile';
//import UserRegister from './pages/user/user_register';
//import Monetary from './pages/donations/monetary';
//import Clothes from './pages/donations/clothes';
//import Foods from './pages/donations/foods';
//import Immigrant from './pages/user/immigrant';  
//import Voluntary from './pages/user/voluntary';  

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">     
        <Routes>
          {/* Rota principal */}
          <Route path="/" element={<Home />} />
          
          {/* Autenticação */}

          
          {/* Páginas de perfil */}

          
          {/* Páginas de doação */}

          
          {/* Páginas de apoio */}

          
          {/* Rota fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;