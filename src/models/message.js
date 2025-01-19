const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const messageSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'Account' },
    buyer: { type: Schema.Types.ObjectId, ref: 'Account' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    url: String,
    sender: { type: Schema.Types.ObjectId, ref: 'Account' },
    message: String,
    images: String,
    isRead: { type: Boolean, default: false },
    timeSend: Date,
    timeRead: Date,
  },
  { timestamps: true }
);
messageSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Message = model('message', messageSchema);
module.exports = Message;
