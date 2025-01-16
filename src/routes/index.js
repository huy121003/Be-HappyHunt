const express = require('express');
const authRouter = require('./authRouter');
const otpRouter = require('./otpRouter');

const app = express();

app.use('/auth/', authRouter);
app.use('/otp/', otpRouter);

module.exports = app;
