const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');

const sampleMessageSchema = new Schema(
  {
    _id: Number,
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: [true, 'Message is required'],
    },
    seller: { type: String, required: [true, 'Seller is required'] },
    buyer: { type: String, required: [true, 'Buyer is required'] },
    category: {
      type: Number,
      ref: 'category',
      required: [true, 'Category is required'],
    },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, sampleMessageSchema, 'sampleMessage');
sampleMessageSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const SampleMessage = model('sampleMessage', sampleMessageSchema);
module.exports = SampleMessage;
