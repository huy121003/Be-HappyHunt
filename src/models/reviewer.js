const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const reviewerSchema = new Schema(
  {
    _id: Number,
    reviewer: { type: Number, ref: 'account', required: true },
    target: { type: Number, ref: 'account', required: true },
    post: { type: Number, ref: 'post', required: true },
    star: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, default: '' },
    isSeller: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);
const applyAutoIncrement = require('../configs/autoIncrement');
reviewerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Reviewer = model('reviewer', reviewerSchema);
module.exports = Reviewer;
