const express = require('express');
const authRouter = require('./authRouter');
const otpRouter = require('./otpRouter');
const fileRouter = require('./fileRouter');
const categoryRouter = require('./categoryRouter');
const policyRouter = require('./policyRouter');
const permissionRouter = require('./permissionRouter');
const app = express();

app.use('/auth/', authRouter);
app.use('/otp/', otpRouter);
app.use('/file/', fileRouter);
app.use('/category/', categoryRouter);
app.use('/policy/', policyRouter);
app.use('/permission/', permissionRouter);

module.exports = app;
