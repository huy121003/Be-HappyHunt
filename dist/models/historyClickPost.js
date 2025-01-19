const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const historyClickPostSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  Post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
}, {
  timestamps: true
});
historyClickPostSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const HistoryClickPost = model('historyClickPost', historyClickPostSchema);
module.exports = HistoryClickPost;