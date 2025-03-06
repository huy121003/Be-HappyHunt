require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const appRouter = require('./features/app/app.router');
require('./features/app/app.task');

// Middleware
app.use(fileUpload());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const allowlist = [
  'http://localhost:3000',
  'http://localhost:3030',
  'https://fe-happy-hunt-admin.vercel.app/',
  'https://fe-happy-hunt-client.vercel.app/',
];
// Cấu hình CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowlist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);

// Định tuyến API
app.use('/api/v1/', appRouter);
app.use((err, req, res, next) => {
  return res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
