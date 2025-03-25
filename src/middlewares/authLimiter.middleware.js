const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  message: 'Too many requests, please try again later',
});

module.exports = {
  authLimiter,
};
