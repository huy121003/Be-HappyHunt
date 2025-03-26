require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
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

// Cấu hình CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);
app.post('/payos/webhook', async (req, res) => {
  console.log('Webhook received:', req.body);
  await paymentController.updatePaymentHistory(req, res);
  res.status(200).send('Webhook received');
});
// Định tuyến API
app.use('/api/v1/', authLimiter, appRouter);
app.use((err, req, res, next) => {
  return res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
