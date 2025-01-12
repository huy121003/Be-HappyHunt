const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;

const accountSchema = new Schema(
  {
    fullName: String,
    email: String,
    phoneNumber: String,
    password: String,
    isBanned: Boolean,
    avatar: String,
    address: String,
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    description: String,
    followers: [String],
    following: [String],
  },
  { timestamps: true }
);

accountSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Account = model('account', accountSchema);
//default data

module.exports = Account;
