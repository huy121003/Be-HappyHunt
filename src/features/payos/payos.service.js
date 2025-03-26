const payOSConfig = require('../../configs/payOS.config');
const PaymentHistory = require('../../models/payment-history');
require('dotenv').config();
const paymentService = require('../payment/payment.service');
require('dotenv').config();
const createPaymentLink = async (data) => {
  try {
    const orderCode = Number(String(Date.now()).slice(-6));
    const description = `Payment ${data.price}  ${orderCode}`;
    const body = {
      orderCode: orderCode,
      description: description,
      amount: Number(data.price),
      items: [
        {
          name: `Pay package of ${data.price} VND`,
          quantity: 1,
          price: Number(data.price),
        },
      ],
      returnUrl: `${process.env.CLIENT_URL}/payment/success`,
      cancelUrl: `${process.env.CLIENT_URL}/payment/cancel`,
    };

    const res = await payOSConfig.createPaymentLink(body);
    let result = null;
    if (res) {
      result = await paymentService.createPaymentHistory({
        ...res,
        createdBy: data.createdBy,
      });
      if (!result) {
        throw new Error('create');
      }
    }

    return result;
  } catch (error) {
    console.error('Error during create payment link:', error);
    throw new Error(error.message);
  }
};

module.exports = {
  createPaymentLink,
};
