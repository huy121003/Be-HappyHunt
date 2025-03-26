const ngrok = require('@ngrok/ngrok');
require('dotenv').config();

const ngrokConnect=async()=>{
  try {
    const listener = await ngrok.connect({
      addr:  process.env.POST_SERVER,
      authtoken: process.env.NGROK_AUTH_TOKEN,
    });
    console.log(`🌍 Ngrok Tunnel URL: ${listener.url()}`);
  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1);
  }
}

module.exports =  ngrokConnect 