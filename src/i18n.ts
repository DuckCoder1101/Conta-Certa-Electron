import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from '@public/locales/en/common.json';
import enErrors from '@public/locales/en/errors.json';

import ptCommon from '@public/locales/pt-BR/common.json';
import ptErrors from '@public/locales/pt-BR/errors.json';

i18n.use(initReactI18next).init({
  ns: ['common', 'errors'],
  defaultNS: 'common',

  resources: {
    en: {
      common: enCommon,
      errors: enErrors,
    },
    'pt-BR': {
      common: ptCommon,
      errors: ptErrors,
    },
  },

  lng: 'pt-BR',
  fallbackLng: 'pt-BR',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
