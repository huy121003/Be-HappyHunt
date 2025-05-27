require('dotenv').config();
const cron = require('node-cron');

const Account = require('../../models/account');
const authService = require('./auth.service');
cron.schedule('*/5 * * * *', async () => {
  try {
    const activeVipAccounts = await Account.find({
      isVip: true,
    });
    if (!activeVipAccounts.length) {
      return;
    }
    for (const account of activeVipAccounts) {
      const vipEndDate = new Date(account.dateVipExpired);
      const currentDate = new Date();
      if (currentDate > vipEndDate) {
        await authService.cancelVip(account._id);
      }
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});
module.exports = cron;
