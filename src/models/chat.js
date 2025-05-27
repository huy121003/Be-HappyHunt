const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const chatSchema = new Schema(
  {
    _id: Number,
    slug: { type: String, required: true, unique: true },
    seller: { type: Number, ref: 'account', required: true },
    buyer: { type: Number, ref: 'account', required: true },
    post: { type: Number, ref: 'post', required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
    lastMessage: {
      //_id: { type: Number, ref: 'message', default: null },
      sender: { type: Number, ref: 'account', default: null },
      status: { type: String, default: 'SENT' },
      timeRead: { type: Date, default: null },
      message: { type: String, default: null },
      image: { type: String, default: null },
      timeSend: { type: Date, default: null },
    },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, chatSchema, 'chat');
chatSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Chat = model('chat', chatSchema);
module.exports = Chat;
