const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const districtSchema = new mongoose.Schema({
  _id: Number,
  codeName: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  provinceId: { type: Number, required: true, ref: 'province' },
  divisionType: { type: String, default: 'district', trim: true },
  shortCodeName: { type: String, required: true, trim: true },
  createdBy: { type: Number, ref: 'account', default: null },
  updatedBy: { type: Number, ref: 'account', default: null },
});

applyAutoIncrement(mongoose, districtSchema, 'district');
districtSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const District = model('district', districtSchema);
module.exports = District;
