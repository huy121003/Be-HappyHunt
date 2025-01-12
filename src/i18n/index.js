const i18next = require('i18next');
const i18nextHttpMiddleware = require('i18next-http-middleware');
const translationEn = require('./en.json');
const translationVn = require('./vn.json');

i18next.use(i18nextHttpMiddleware.LanguageDetector).init({
  detection: {
    order: ['header'],
    lookupHeader: 'accept-language',
  },
  preload: ['en', 'vn'],
  fallbackLng: 'vn',
  resources: {
    en: { translation: translationEn },
    vn: { translation: translationVn },
  },
});
module.exports = {
  i18next,
  i18nextHttpMiddleware,
};
