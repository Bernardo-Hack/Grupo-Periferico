// Crie um componente Translator.tsx
import { useEffect } from 'react';

const Translator = () => {
  useEffect(() => {
    const googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          includedLanguages: 'en,es,fr,de,it,ja,ko,pt,ru,zh-CN',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
    
    (window as any).googleTranslateElementInit = googleTranslateElementInit;

    return () => {
      document.body.removeChild(script);
      delete (window as any).googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" style={{ margin: '10px' }}></div>;
};

export default Translator;