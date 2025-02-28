const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const messageSchema = new Schema(
  {
    _id: Number,
    seller: {
      type: Number,
      ref: 'account',
      required: [true, 'Seller is required'],
    },
    buyer: {
      type: Number,
      ref: 'account',
      required: [true, 'Buyer is required'],
    },
    post: { type: Number, ref: 'post', required: [true, 'Post is required'] },
    url: { type: String, required: [true, 'URL is required'] },
    sender: {
      type: Number,
      ref: 'account',
      required: [true, 'Sender is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: [true, 'Message should not have leading or trailing whitespaces'],
    },
    images: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    timeSend: { type: Date, default: Date.now },
    timeRead: { type: Date, default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, messageSchema, 'message');
messageSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Message = model('message', messageSchema);
module.exports = Message;
