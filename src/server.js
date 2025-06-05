const app = require('./app');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { mongoConfig } = require('./configs');
require('dotenv').config();
const appController = require('./features/app/app.controller');
const ngrokConnect = require('./configs/ngrok.config');
const { setupAppSocket } = require('./features/app/app.socket');

(async () => {
  try {
    await mongoConfig();

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
    });

    // Initialize socket handlers
    setupAppSocket(io);

    httpServer.listen(process.env.POST_SERVER, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${process.env.POST_SERVER}`);
      console.log(`🔌 WebSocket server is ready`);
    });

   // await ngrokConnect();
    await Promise.all([
      appController.autoCreatePermission(),
      appController.autoCreateRole(),
      appController.autoCreateAdmin(),
      appController.createAutoAddress(),
    ]);

    // Call the classifyImageFromUrl function
  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }
})();
