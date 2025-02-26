const app = require('./app');
const { mongoConfig } = require('./configs');
const port = process.env.PORT || 8000;
const hostname = process.env.HOST_NAME || 'localhost';
const { i18next } = require('./configs').translateConfig;
const permissionController = require('./features/permission/permission.controller');
const roleController = require('./features/role/role.controller');
const accountController = require('./features/account/account.controller');
(async () => {
  try {
    await mongoConfig(); // Kết nối MongoDB
    app.listen(port, hostname, () => {
      console.log(`${i18next.t('listen')} http://${hostname}:${port}`);
    });
    await permissionController.autoCreatePermissionMany();
    await roleController.autoCreateRole();
    await accountController.autoCreateAdmin();
  } catch (error) {
    console.error(' Error during startup:', error);
    process.exit(1); // Thoát chương trình nếu có lỗi
  }
})();
