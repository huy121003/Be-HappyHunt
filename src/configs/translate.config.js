const i18next = require('i18next');
const i18nextHttpMiddleware = require('i18next-http-middleware');
const { en,vi } = require('../i18n');



i18next.use(i18nextHttpMiddleware.LanguageDetector).init({
  detection: {
    order: ['header'],
    lookupHeader: 'accept-language',
  },
  preload: ['en', 'vi'],
  fallbackLng: 'vi',
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
});
module.exports = {
  i18next,
  i18nextHttpMiddleware,
};