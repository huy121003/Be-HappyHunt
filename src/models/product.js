const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;
const productSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    seller: { type: Schema.Types.ObjectId, ref: 'Account' },
    buyer: { type: Schema.Types.ObjectId, ref: 'Account' },
    name: String,
    price: Number,
    description: String,
    images: [String],
    status: {
      type: String,
      enum: ['selling', 'sold', 'expire', 'pending'],
      default: 'expire',
    },
    clickCount: Number,
    acttributes: [
      {
        name: String,
        value: String,
        unit: String,
      },
    ],

    warrantyPolicy: String,
    startPost: Date,
    endPost: Date,
    url: String,
    address: {
      city: String,
      district: String,
      ward: String,
      specificAddress: String,
    },
  },
  { timestamps: true }
);
productSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const Product = model('product', productSchema);
module.exports = Product;
