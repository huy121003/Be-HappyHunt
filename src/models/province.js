const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const provinceSchema = new mongoose.Schema({
  _id: Number,
  codeName: { type: String, required: true },
  name: { type: String, required: true },
});
applyAutoIncrement(mongoose, provinceSchema, 'province');
provinceSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Province = model('province', provinceSchema);
module.exports = Province;
