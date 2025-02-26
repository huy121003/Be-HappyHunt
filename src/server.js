const app = require('./app');
const { mongoConfig } = require('./configs');
const port = process.env.PORT || 8000;
const hostname = process.env.HOST_NAME || 'localhost';
const { i18next } = require('./configs').translateConfig;
const accountController = require('./features/account/account.controller');
const appController = require('./features/app/app.controller');
(async () => {
  try {
    await mongoConfig(); // Kết nối MongoDB
    app.listen(port, hostname, () => {
      console.log(`${i18next.t('listen')} http://${hostname}:${port}`);
    });
    await appController.autoCreatePermission();
    await appController.autoCreateRole();
    await appController.autoCreateAdmin();
    await appController.createAutoAddress();
  } catch (error) {
    console.error(' Error during startup:', error);
    process.exit(1); // Thoát chương trình nếu có lỗi
  }
})();
