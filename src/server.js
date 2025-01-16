require('dotenv').config();
const express = require('express');
const { i18next, i18nextHttpMiddleware } = require('./i18n');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8001;
const hostname = process.env.HOST_NAME || 'localhost';
const connection = require('./configs/database');
const indexRouter = require('./routes/index');
const { ErrorResponse, sendNotFound } = require('./helpers/apiHelper');
const { autoCreateAdmin } = require('./controllers/accountController');
require('./tasks');
const {
  authMiddlewareAccessToken,
  authMiddlewareRefreshToken,
} = require('./middlewares/authMiddleware');

// CORS middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

// Middleware xử lý request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(authMiddlewareAccessToken);
// Config i18n
app.use(i18nextHttpMiddleware.handle(i18next));

// Routes công khai
app.use('/api/v1/', indexRouter);

// Middleware chỉ áp dụng cho route bảo mật);

// Kết nối cơ sở dữ liệu và khởi động server
(async () => {
  try {
    console.log('Connecting to database...');
    await connection();
    console.log('Database connected.');

    await autoCreateAdmin();
    console.log('Admin account created.');

    app.listen(port, hostname, () => {
      console.log(`${i18next.t('listen')} http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('Error during startup:', error);
  }
})();
