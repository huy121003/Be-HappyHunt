const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const reviewerSchema = new Schema(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    target: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    star: {
      type: Number,
      min: 1,
      max: 5,
    },
    content: String,
    isSeller: Boolean,
  },
  { timestamps: true }
);
reviewerSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Reviewer = model('reviewer', reviewerSchema);
module.exports = Reviewer;
