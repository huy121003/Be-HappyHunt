// const mongoose = require('mongoose');
// require('dotenv').config();

// const dbState = [
//   { value: 0, name: 'Disconnected' },
//   { value: 1, name: 'Connected' },
//   { value: 2, name: 'Connecting' },
//   { value: 3, name: 'Disconnecting' },
// ];
// const mongo = async () => {
//   const options = {
//     user: process.env.DB_USER,
//     pass: process.env.DB_PASSWORD,
//     dbName: process.env.DB_NAME,
//   };
//   await mongoose.connect(process.env.DB_HOST, options);
//   const state = Number(mongoose.connection.readyState);
//   console.log('Connected to database', dbState[state].name);
// };
// module.exports = mongo;

const mongoose = require('mongoose');
require('dotenv').config();

const dbState = [
  { value: 0, name: 'Disconnected' },
  { value: 1, name: 'Connected' },
  { value: 2, name: 'Connecting' },
  { value: 3, name: 'Disconnecting' },
];

const mongo = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO); // Không cần thêm các options cũ

    const state = mongoose.connection.readyState;
    console.log(`✅ Connected to database: ${dbState[state].name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = mongo;
