const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const roleSchema = new Schema({
  name: String,
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  description: String
}, {
  timestamps: true
});
roleSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Role = model('role', roleSchema);
module.exports = Role;