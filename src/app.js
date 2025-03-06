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
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    console.log('err', err.details.query);
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
