const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const notificationSchema = new Schema(
  {
    _id: Number,
    target: { type: Number, ref: 'account', required: true },
    post: { type: Number, ref: 'post', default: null },
    type: {
      type: String,
      enum: [
        'FIRST_LOGIN',
        'FOLLOW_ACCOUNT',
        'NEW_POST',
        'NEW_MESSAGE',
        'POST_APPROVED',
        'POST_REJECTED',
        'POST_EXPIRED',
        'POST_DELETED',
        'POST_WAITING_APPROVE',
        'VIP_EXPIRED',
        'VIP_ACTIVE',
      ],
      default: 'POST_WAITING_APPROVE',
    },
    read: { type: Boolean, default: false },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, notificationSchema, 'notification');
notificationSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Notification = model('notification', notificationSchema);
module.exports = Notification;
