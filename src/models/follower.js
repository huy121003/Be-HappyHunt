const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const followerSchema = new Schema(
  {
    _id: Number,
    follower: {
      type: Number,
      ref: 'account',
      required: [true, 'Follower is required'],
    },
    following: {
      type: Number,
      ref: 'account',
      required: [true, 'Following is required'],
    },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, followerSchema, 'follower');
followerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Follower = model('follower', followerSchema);
module.exports = Follower;
