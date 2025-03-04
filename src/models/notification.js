const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const notificationSchema = new Schema(
  {
    _id: Number,
    target: {
      type: Number,
      ref: 'account',
      required: [true, 'Target is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: [true, 'Content is required'],
    },
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
    url: {
      type: String,
      request: [true, 'URL is required'],
      trim: [true, 'URL is required'],
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
