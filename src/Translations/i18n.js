import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enIncomePage from './locales/en/incomePage.json';
import deIncomePage from './locales/de/incomePage.json';
import enExpensesPage from './locales/en/expensesPage.json';
import deExpensesPage from './locales/de/expensesPage.json';
import enPocketsPage from './locales/en/pocketsPage.json';  
import dePocketsPage from './locales/de/pocketsPage.json'; 

i18n.use(initReactI18next).init({
  resources: {
    en: {
      incomePage: enIncomePage,
      expensesPage: enExpensesPage,
      pocketsPage: enPocketsPage,  
    },
    de: {
      incomePage: deIncomePage,
      expensesPage: deExpensesPage,
      pocketsPage: dePocketsPage,  
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  ns: ['incomePage', 'expensesPage', 'pocketsPage'],  
  defaultNS: 'incomePage',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
