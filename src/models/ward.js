const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const wardSchema = new mongoose.Schema({
  _id: Number,
  codeName: { type: String, required: true },
  name: { type: String, required: true },
  provinceId: { type: Number, required: true, ref: 'province' },
  districtId: { type: Number, required: true, ref: 'district' },
});
applyAutoIncrement(mongoose, wardSchema, 'ward');
wardSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Ward = model('ward', wardSchema);
module.exports = Ward;
