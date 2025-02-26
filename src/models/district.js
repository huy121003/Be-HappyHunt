const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const districtSchema = new mongoose.Schema({
  _id: Number,
  codeName: { type: String, required: true },
  name: { type: String, required: true },
  provinceId: { type: Number, required: true, ref: 'province' },
});

applyAutoIncrement(mongoose, districtSchema, 'district');
districtSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const District = model('district', districtSchema);
module.exports = District;
