const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const wardSchema = new Schema({
  _id: Number,
  codeName: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: Number,
    required: true,
    ref: 'province',
  },
  district: {
    type: Number,
    required: true,
    ref: 'district',
  },
  divisionType: { type: String, default: 'ward' },
  shortCodeName: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: { type: Number, ref: 'account', default: null },
  updatedBy: { type: Number, ref: 'account', default: null },
});

applyAutoIncrement(mongoose, wardSchema, 'ward');
wardSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Ward = model('ward', wardSchema);
module.exports = Ward;
