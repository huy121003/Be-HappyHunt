const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const wardSchema = new Schema({
  _id: Number,
  codeName: {
    type: String,
    required: [true, 'Code name is required'],
    trim: [true, 'Code name is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: [true, 'Name is required'],
  },
  provinceId: {
    type: Number,
    required: [true, 'Province ID is required'],
    ref: 'province',
  },
  districtId: {
    type: Number,
    required: [true, 'District ID is required'],
    ref: 'district',
  },
  divisionType: {
    type: String,
    default: 'ward',
  },
  shortCodeName: {
    type: String,
    required: [true, 'Short code name is required'],
    trim: [true, 'Short code name is required'],
  },
  createdBy: { type: Number, ref: 'account', default: null },
  updatedBy: { type: Number, ref: 'account', default: null },
});

applyAutoIncrement(mongoose, wardSchema, 'ward');
wardSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Ward = model('ward', wardSchema);
module.exports = Ward;
