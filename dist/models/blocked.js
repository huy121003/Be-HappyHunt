const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const blockedSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  blockedId: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  reason: String
}, {
  timestamps: true
});
blockedSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Blocked = model('blocked', blockedSchema);
module.exports = Blocked;