const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const applyAutoIncrement = require('../configs/autoIncrement');
const { Schema, model } = mongoose;
const evaluateSchema = new Schema(
  {
    _id: Number,
    target: { type: Number, ref: 'account', required: true },
   
    post: { type: Number, ref: 'post', required: true },
    star: { type: Number, min: 1, max: 5, required: true },
    content: { type: [String], default: [] },
    description: { type: String, default: '' },
    isSeller: { type: Boolean, default: false, required: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, evaluateSchema, 'evaluate');
evaluateSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Evaluate = model('evaluate', evaluateSchema);
module.exports = Evaluate;
