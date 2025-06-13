const cron = require('node-cron');
const { Otp } = require('../../models');

// Cron job để kiểm tra và xóa OTP hết hạn sau 10 giây
cron.schedule('1 * * * * *', () => {
  // Chạy mỗi giây
  const expiryTime = Date.now() - 60000; // 10 giây trước

  Otp.deleteMany({ createdAt: { $lt: new Date(expiryTime) } });
});
