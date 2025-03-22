const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const applyAutoIncrement = require('../configs/autoIncrement');
const categorySchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: [true, 'Name is required'],
      unique: [true, 'Duplicate name'],
    },
    parent: { type: Number, ref: 'category', default: null },
    isPayment: { type: Boolean, default: false },
    pricePayment: { type: Number, default: 0 },
    attributes: [
      {
        name: { type: String, required: true, trim: true },
        values: [{ type: String, trim: true }],
        isRequired: { type: Boolean, default: false },
        isShow: { type: Boolean, default: false },
        type: {
          type: String,
          required: true,
          enum: ['STRING', 'SELECT', 'NUMBER', 'BOOLEAN', 'RADIO', 'CHECKBOX'],
        },
        _id: false,
      },
    ],
    slug: { type: String, required: true, unique: true, default: 'ee' },
    keywords: [{ type: String, required: true }],
    description: { type: String, default: '' },
    icon: { type: String, required: true, trim: true },
    createdBy: { type: Number, ref: 'account', default: null },
    updatedBy: { type: Number, ref: 'account', default: null },
  },
  { timestamps: true }
);

applyAutoIncrement(mongoose, categorySchema, 'category');
categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });

const Category = model('category', categorySchema);

module.exports = Category;
