const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const messageSchema = new Schema(
  {
    _id: Number,
    chat: { type: Number, ref: 'chat', required: true },
    message: { type: String, trim: true },
    image: { type: String, default: '' },
    timeSend: { type: Date, default: Date.now },
    sender: { type: Number, ref: 'account', required: true },
    timeRead: { type: Date, default: null },
    status: {
      type: String,
      enum: ['SENT', 'DELIVERED', 'READ'],
      default: 'SENT',
    },
    createBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },

  { timestamps: true }
);
applyAutoIncrement(mongoose, messageSchema, 'message');
messageSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Message = model('message', messageSchema);
module.exports = Message;
