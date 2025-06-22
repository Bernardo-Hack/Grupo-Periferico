// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, FC, ReactNode, useRef } from 'react';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Adm from './pages/adm/admin';
import AdminLogin from './pages/adm/adminLogin'; // <-- Importação do novo login
import Home from './pages/home';
import Monetary from './pages/donations/monetary';
import Clothes from './pages/donations/clothes';
import Foods from './pages/donations/foods';
import UserRegister from './pages/user/user_register';
import Immigrant from './pages/user/immigrant';
import Voluntary from './pages/user/voluntary';
import Profile from './pages/user/profile';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; layout: number },
          elementId: string
        ) => void;
        InlineLayout?: { SIMPLE: number };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const GoogleTranslateWidget: FC = () => {
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const initGoogleTranslate = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          includedLanguages: 'en,es,fr,de,it,pt',
          layout: window.google.translate.InlineLayout?.SIMPLE || 0,
        },
        'google_translate_element'
      );
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-banner-frame, .goog-te-footer, .goog-logo-link, .goog-te-gadget a[href^="https://translate.google.com"] { display: none !important; }
        body { top: 0 !important; }
      `;
      document.head.appendChild(style);
    };

    const loadScript = () => {
      if (document.querySelector('script[src*="translate.google.com"]')) return;
      script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onload = () => (window.googleTranslateElementInit = initGoogleTranslate);
      document.body.appendChild(script);
      observerRef.current = new MutationObserver(() => initGoogleTranslate());
      observerRef.current.observe(document.body, { childList: true, subtree: true });
    };

    const id = setTimeout(loadScript, 500);
    return () => {
      clearTimeout(id);
      if (script) document.body.removeChild(script);
      observerRef.current?.disconnect();
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000, height: 40, overflow: 'hidden' }}>
      <div id="google_translate_element" style={{ transform: 'translateY(-4px) scale(0.95)' }} />
    </div>
  );
};

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="app-container">
    <GoogleTranslateWidget />
    {children}
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MainLayout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/registro" element={<UserRegister />} />
            <Route path="/doacao-monetaria" element={<Monetary />} />
            <Route path="/doacao-roupas" element={<Clothes />} />
            <Route path="/doacao-alimentos" element={<Foods />} />
            <Route path="/imigrantes" element={<Immigrant />} />
            <Route path="/voluntarios" element={<Voluntary />} />
            <Route path="/admin" element={<Adm />} />
            <Route path="/login-admin" element={<AdminLogin />} /> {/* <- AQUI */}
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </ThemeProvider>
    </BrowserRouter>
  );
}
