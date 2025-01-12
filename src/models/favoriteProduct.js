const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;

const favoriteProductSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  product: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});
favoriteProductSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const FavoriteProduct = model('favoriteProduct', favoriteProductSchema);
module.exports = FavoriteProduct;
