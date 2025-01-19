const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const followerSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  }
}, {
  timestamps: true
});
followerSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Follower = model('follower', followerSchema);
module.exports = Follower;