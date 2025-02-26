const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const sampleMessageSchema = new Schema(
  {
    _id: Number,
    message: String,
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
    category: { type: Number, ref: 'category', required: true },
  },
  { timestamps: true }
);
applyAutoIncrement(mongoose, sampleMessageSchema, 'sampleMessage');
sampleMessageSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const SampleMessage = model('sampleMessage', sampleMessageSchema);
module.exports = SampleMessage;
