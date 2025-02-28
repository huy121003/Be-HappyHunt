const app = require('./app');
const { mongoConfig } = require('./configs');
require('dotenv').config();
const port = process.env.POST_SERVER;
const hostname = process.env.HOST_NAME;
const appController = require('./features/app/app.controller');
(async () => {
  try {
    await mongoConfig(); // Kết nối MongoDB
    app.listen(port, hostname, () => {
      console.log(`Server is running at http://${hostname}:${port}`);
    });
    await appController.autoCreatePermission();
    await appController.autoCreateRole();
    await appController.autoCreateAdmin();
    await appController.createAutoAddress();
    await appController.autoCreatePolicy();
  } catch (error) {
    console.error(' Error during startup:', error);
    process.exit(1); // Thoát chương trình nếu có lỗi
  }
})();
