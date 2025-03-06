const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const notificationSchema = new Schema(
  {
    _id: Number,
    target: { type: Number, ref: 'account', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        'firstLogin',
        'newPostFromFollowedUser',
        'newPost',
        'expirePost',
        'successPost',
        'deletePost',
        'newMessage',
        'newFollower',
      ],
      default: 'newPost',
    },
    url: { type: String, request: true, trim: true },
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
