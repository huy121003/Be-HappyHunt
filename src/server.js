const app = require('./app');
const { mongoConfig } = require('./configs');
require('dotenv').config();

const port = process.env.POST_SERVER || 8000;
const appController = require('./features/app/app.controller');

(async () => {
  try {
    await mongoConfig();

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });

    await Promise.all([
      appController.autoCreatePermission(),
      appController.autoCreateRole(),
      appController.autoCreateAdmin(),
      appController.createAutoAddress(),
    ]);
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
})();
