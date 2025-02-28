const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const historyClickPostSchema = new Schema(
  {
    _id: Number,
    account: {
      type: Number,
      ref: 'account',
      required: [true, 'Account is required'],
    },
    post: { type: Number, ref: 'post', required: [true, 'Post is required'] },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, historyClickPostSchema, 'historyClickPost');
historyClickPostSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const HistoryClickPost = model('historyClickPost', historyClickPostSchema);
module.exports = HistoryClickPost;
