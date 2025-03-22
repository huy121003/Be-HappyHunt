const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const historyClickPostSchema = new Schema(
  {
    _id: Number,
    post: { type: Number, ref: 'post', required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, historyClickPostSchema, 'historyClickPost');
historyClickPostSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const HistoryClickPost = model('historyClickPost', historyClickPostSchema);
module.exports = HistoryClickPost;
