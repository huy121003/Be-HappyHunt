const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const chatSchema = new Schema(
  {
    _id: Number,
    seller: { type: Number, ref: 'account', required: true },
    buyer: { type: Number, ref: 'account', required: true },
    post: { type: Number, ref: 'post', required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
    // lastMessage: {
    //   sender: { type: Number, ref: 'account', required: true },
    //   image: { type: String, default: '' },
    //   message: { type: String, default: '' },
    //   time: { type: Date, default: null },
    // },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, chatSchema, 'chat');
chatSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Chat = model('chat', chatSchema);
module.exports = Chat;
