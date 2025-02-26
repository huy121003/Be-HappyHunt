const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const messageSchema = new Schema(
  {
    _id: Number,
    seller: { type: Number, ref: 'account', required: true },
    buyer: { type: Number, ref: 'account', required: true },
    post: { type: Number, ref: 'post', required: true },
    url: { type: String, required: true },
    sender: { type: Number, ref: 'account', required: true },
    message: { type: String, required: true, trim: true },
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
