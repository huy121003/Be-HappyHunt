require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const {
  i18next,
  i18nextHttpMiddleware
} = require('./i18n');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload());
app.use(cookieParser());
const port = process.env.PORT || 8001;
const hostname = process.env.HOST_NAME || 'localhost';
const connection = require('./configs/database');
const indexRouter = require('./routes/index');
const {
  autoCreateAdmin
} = require('./controllers/accountController');
const {
  autoCreatePermissionMany
} = require('./controllers/permissionController');
const {
  autoCreatePolicy
} = require('./controllers/policyController');
const {
  autoCreateRole
} = require('./controllers/roleController');
require('./tasks');

// CORS middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

// Middleware xử lý request body
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// app.use(authMiddlewareAccessToken);
// Config i18n
app.use(i18nextHttpMiddleware.handle(i18next));

// Routes công khai
app.use('/api/v1/', indexRouter);

// Kết nối cơ sở dữ liệu và khởi động server
(async () => {
  try {
    await connection();
    await autoCreatePermissionMany();
    await autoCreateRole();
    await autoCreatePolicy();
    await autoCreateAdmin();
    app.listen(port, hostname, () => {
      console.log(`${i18next.t('listen')} http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('Error during startup:', error);
  }
})();