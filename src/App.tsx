import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, FC, ReactNode, useRef } from 'react';
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

// Global types for Google Translate widget
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
          },
          elementId: string
        ) => void;
        TranslateElementInit?: () => void;
        InlineLayout?: {
          SIMPLE: number;
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

// Google Translate Widget component
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
          layout: window.google.translate.InlineLayout?.SIMPLE || 0
        },
        'google_translate_element'
      );
      removeGoogleBranding();
    };

    const removeGoogleBranding = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        .goog-te-banner-frame,
        .goog-te-footer,
        .goog-logo-link,
        .goog-te-gadget a[href^="https://translate.google.com"] {
          display: none !important;
        }
        body { top: 0 !important; }
      `;
      document.head.appendChild(style);
    };

    const loadScript = () => {
      if (document.querySelector('script[src*="translate.google.com"]')) return;
      script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onload = () => {
        window.googleTranslateElementInit = initGoogleTranslate;
      };
      document.body.appendChild(script);

      observerRef.current = new MutationObserver(() => {
        if (document.querySelector('.goog-te-banner-frame')) {
          removeGoogleBranding();
        }
      });
      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    const timeoutId = setTimeout(loadScript, 1000);
    return () => {
      clearTimeout(timeoutId);
      if (script) document.body.removeChild(script);
      observerRef.current?.disconnect();
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        height: '40px',
        overflow: 'hidden'
      }}
    >
      <div
        id="google_translate_element"
        style={{ transform: 'translateY(-4px) scale(0.95)' }}
      ></div>
    </div>
  );
};

// Main Layout component
const MainLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="app-container">
    <GoogleTranslateWidget />
    {children}
  </div>
);

// App component with BrowserRouter
function App() {
  return (
    <BrowserRouter>
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
          <Route path="*" element={<Home />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;