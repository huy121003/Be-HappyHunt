require('dotenv').config();
const policyData = {
  limitPost: Number(process.env.LIMIT_POST_DEFAULT),
  timeExpired: Number(process.env.TIME_EXPIRED),
  minImagePost: Number(process.env.MIN_IMAGE_POST),
  maxImagePost: Number(process.env.MAX_IMAGE_POST),
  spamMessageCount: Number(process.env.SPAM_MESSAGE_COUNT),
  moneyToCoin: Number(process.env.MONEY_TO_COIN),
  coinToVip: Number(process.env.COIN_TO_VIP)
};
module.exports = policyData;