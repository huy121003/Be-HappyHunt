const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const notificationSchema = new Schema({
  target: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  title: String,
  content: String,
  type: {
    type: String,
    enum: ['firstLogin', 'newPostFromFollowedUser', 'newPost', 'expirePost', 'successPost', 'deletePost', 'newMessage', 'newFollower'],
    default: 'newPost'
  },
  url: String,
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
notificationSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Notification = model('notification', notificationSchema);
module.exports = Notification;