const ngrok = require('@ngrok/ngrok');
const payosService = require('../features/payos/payos.service');
require('dotenv').config();

const ngrokConnect=async()=>{
  try {
    const listener = await ngrok.connect({
      addr:  process.env.POST_SERVER,
      authtoken: process.env.NGROK_AUTH_TOKEN,
    });
   console.log(`🌍 Ngrok Tunnel URL: ${listener.url()}`);
const webhookUrl = `${listener.url()}/payos/webhook`;
await payosService.confirmWebhook(webhookUrl);
  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }
}

module.exports =  ngrokConnect 