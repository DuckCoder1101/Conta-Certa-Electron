import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@public/locales/en/translation.json';
import ptBR from '@public/locales/pt-BR/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    'pt-BR': {
      translation: ptBR,
    },
  },
  lng: 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
