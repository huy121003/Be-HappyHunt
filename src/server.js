const app = require('./app');
const { mongoConfig } = require('./configs');
const port = process.env.PORT || 8000;
const hostname = process.env.HOST_NAME || 'localhost';
const { i18next } = require('./configs').translateConfig;

(async () => {
  try {
    await mongoConfig(); // Kết nối MongoDB

    app.listen(port, hostname, () => {
      console.log(`${i18next.t('listen')} http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1); // Thoát chương trình nếu có lỗi
  }
})();
