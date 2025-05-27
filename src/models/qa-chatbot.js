const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const qaChatbotSchema = new Schema(
  {
    _id: Number,
    question: { type: String, trim: true, required: true },
    answer: { type: String, trim: true, required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, qaChatbotSchema, 'qa-chatbot');
qaChatbotSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const QaChatbot = model('qa-chatbot', qaChatbotSchema);
module.exports = QaChatbot;

