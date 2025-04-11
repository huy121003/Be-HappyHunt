const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const sampleMessageSchema = new Schema({
  _id: Number,
  message: { type: String, required: true },
  createdBy: { type: Number, ref: 'account', default: null },
  updatedBy: { type: Number, ref: 'account', default: null },
});

applyAutoIncrement(mongoose, sampleMessageSchema, 'sampleMessage');
sampleMessageSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const SampleMessage = model('sampleMessage', sampleMessageSchema);
module.exports = SampleMessage;
