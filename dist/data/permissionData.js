const perimissionData = [{
  method: 'POST',
  type: 'Auth',
  name: 'Login',
  description: 'Login',
  url: '/auth/login'
}, {
  method: 'POST',
  type: 'Auth',
  name: 'Register',
  description: 'Register',
  url: '/auth/register'
}, {
  method: 'POST',
  type: 'Auth',
  name: 'Register OTP',
  description: 'Register OTP',
  url: '/auth/register-otp'
}, {
  method: 'POST',
  type: 'Auth',
  name: 'Logout',
  description: 'Logout',
  url: '/auth/logout'
}, {
  method: 'POST',
  type: 'Auth',
  name: 'Forgot Password',
  description: 'Forgot Password',
  url: '/auth/forgot-password'
}, {
  method: 'POST',
  type: 'Auth',
  name: 'Forgot Password OTP',
  description: 'Forgot Password OTP',
  url: '/auth/forgot-password-otp'
}, {
  method: 'POST',
  type: 'Auth',
  name: 'Reset Password',
  description: 'Reset Password',
  url: '/auth/reset-password'
}, {
  method: 'GET',
  type: 'Auth',
  name: 'Get Account Info',
  description: 'Get Account Info',
  url: '/auth/get-account-info'
}, {
  method: 'GET',
  type: 'Auth',
  name: 'Get New Access Token',
  description: 'Get New Access Token',
  url: '/auth/get-new-access-token'
}, {
  method: 'POST',
  type: 'OTP',
  name: 'Send OTP',
  description: 'Send OTP',
  url: '/otp/send'
}, {
  method: 'POST',
  type: 'OTP',
  name: 'Verify OTP',
  description: 'Verify OTP',
  url: '/otp/verify'
}];
module.exports = perimissionData;