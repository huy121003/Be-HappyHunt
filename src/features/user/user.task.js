const cron = require('node-cron');
const Account = require('../../models/account');
const userService = require('./user.service');
cron.schedule('*/1 * * * *', async () => {
  try {
    const accounts = await Account.find({ role: null });

    for (const user of accounts) {
      const { reportAmount = 0, banAmount = 0, isBanned } = user;

      // Tính bội số hiện tại
      const threshold = Math.floor(reportAmount / 5);

      // Nếu đủ bội mới và chưa bị ban tương ứng
      if (threshold > banAmount) {
        user.isBanned = true;
        user.banAmount = threshold;
        const updatedUser = await userService.banned(user._id, {
          isBanned: false,
        });
        if (!updatedUser) {
          console.error(`Failed to ban user with ID: ${user._id}`);
        } else {
          console.log(`User with ID: ${user._id} has been banned.`);
        }
      }
    }
  } catch (error) {
    console.error('🚨 Error banning users with spam reports:', error.message);
  }
});

module.exports = cron;
