require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { i18next, i18nextHttpMiddleware } = require('./configs').translateConfig;
require('module-alias/register');

const app = express();
const appRouter = require('./app.router');
require('./app.task'); // Chạy tác vụ nền (cron jobs, schedulers, v.v.)

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

// Middleware xử lý ngôn ngữ
app.use(i18nextHttpMiddleware.handle(i18next));

// Định tuyến API
app.use('/api/v1/', appRouter);

module.exports = app;
