const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const provinceSchema = new mongoose.Schema({
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
  divisionType: {
    type: String,

    default: 'province',
  },
  phoneCode: {
    type: Number,
    required: [true, 'Phone code is required'],
    unique: [true, 'Phone code is required'],
  },
  createdBy: { type: Number, ref: 'account', default: null },
  updatedBy: { type: Number, ref: 'account', default: null },
});
applyAutoIncrement(mongoose, provinceSchema, 'province');
provinceSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Province = model('province', provinceSchema);
module.exports = Province;
