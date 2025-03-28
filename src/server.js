const app = require('./app');
const { mongoConfig } = require('./configs');
require('dotenv').config();
const appController = require('./features/app/app.controller');
const ngrokConnect = require('./configs/ngrok.config');

(async () => {
  try {
    await mongoConfig();

    app.listen(process.env.POST_SERVER, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${process.env.POST_SERVER}`);
    });
    // await ngrokConnect();
    await Promise.all([
      appController.autoCreatePermission(),
      appController.autoCreateRole(),
      appController.autoCreateAdmin(),
      appController.createAutoAddress(),
    ]);
  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }
})();
