require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

require('module-alias/register');

const app = express();
const appRouter = require('./features/app/app.router');
require('./features/app/app.task');

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

// Định tuyến API
app.use('/api/v1/', appRouter);

module.exports = app;
