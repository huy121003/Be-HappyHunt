const app = require('./app');
const { mongoConfig } = require('./configs');
require('dotenv').config();

const port = process.env.POST_SERVER || 3000; // Dùng giá trị mặc định nếu không có
const appController = require('./features/app/app.controller');

(async () => {
  try {
    await mongoConfig(); // Kết nối MongoDB

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });

    await Promise.all([
      appController.autoCreatePermission(),
      appController.autoCreateRole(),
      appController.autoCreateAdmin(),
      appController.createAutoAddress(),
      appController.autoCreatePolicy(),
    ]);
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
})();
