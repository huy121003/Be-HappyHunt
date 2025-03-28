const payOSConfig = require('../../configs/payOS.config');
const PaymentHistory = require('../../models/payment-history');
require('dotenv').config();
const paymentService = require('../payment/payment.service');
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
    const transactionDateTime = new Date(
      Date.now() - Math.floor(Math.random() * 20 * 24 * 60 * 60 * 1000)
    );

    if (res) {
      result = await paymentService.createPaymentHistory({
        ...res,
        //   status: 'SUCCESS',
        //  transactionDateTime: transactionDateTime,

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
const getPaymentLinkInformation = async (id) => {
  try {
    const response = await payOSConfig.getPaymentLinkInformation(id);
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
const confirmWebhook = async (url) => {
  console.log('🔗 Webhook URL gửi lên PayOS:', url);
  try {
    const result = await payOSConfig.confirmWebhook(String(url));
    if (!result) {
      throw new Error('confirm');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const verifyPaymentWebhook = async (data) => {
  try {
    const result = await payOSConfig.verifyPaymentWebhookData(data);
    if (!result) {
      throw new Error('verify');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const cancelPaymentLink = async (id) => {
  try {
    const result = await payOSConfig.cancelPaymentLink(id);
    if (!result) {
      throw new Error('cancel');
    }

    const status = await paymentService.updateStatusByPaymentLinkId(id, {
      status: 'CANCELLED',
    });

    if (!status) {
      throw new Error('update');
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createPaymentLink,
  getPaymentLinkInformation,
  confirmWebhook,
  cancelPaymentLink,
  verifyPaymentWebhook,
};
