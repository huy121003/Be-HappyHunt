const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const historySearchSchema = new Schema(
  {
    _id: Number,
    account: {
      type: Number,
      ref: 'account',
      required: [true, 'Account is required'],
    },
    keyword: {
      type: String,
      required: true,
      trim: [true, 'Keyword is required'],
    },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, historySearchSchema, 'historySearch');
historySearchSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const HistorySearch = model('historySearch', historySearchSchema);
module.exports = HistorySearch;
