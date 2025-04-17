require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const appRouter = require('./features/app/app.router');
const { authLimiter } = require('./middlewares/authLimiter.middleware');
require('./features/app/app.task');
const paymentController = require('./features/payment/payment.controller');
// Middleware
app.use(fileUpload());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('trust proxy', 1);

// Cấu hình CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);
app.post('/payos/webhook', async (req, res) => {
  await paymentController.updatePaymentHistory(req, res);
  return res.status(200).json({ message: 'Webhook received' });
});
app.use('/sleeper', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});
// Định tuyến API
app.use('/api/v1/', authLimiter, appRouter);
app.use((err, req, res, next) => {
  return res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
