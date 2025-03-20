require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
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

// Cấu hình middleware express-fileupload
const uploadDir = path.join(__dirname, '../src/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));
// Định tuyến API
app.use('/api/v1/', appRouter);
app.use((err, req, res, next) => {
  return res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
