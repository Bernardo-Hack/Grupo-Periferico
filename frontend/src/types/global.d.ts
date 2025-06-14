declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: GoogleTranslateOptions,
          elementId: string
        ) => void;
        TranslateElementInit?: () => void;
        InlineLayout?: {
          SIMPLE: number;
        };
      };
    };
    googleTranslateElementInit?: () => void; // Propriedade opcional
  }
}

interface GoogleTranslateOptions {
  pageLanguage: string;
  includedLanguages: string;
  layout: number;
}

export {};