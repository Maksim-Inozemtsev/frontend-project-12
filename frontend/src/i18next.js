import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.js';

i18next 
  .use(initReactI18next)
  .init({
    resources: {
      ru,
    },
    lng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });

export default i18next;