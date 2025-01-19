const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const { Schema, model } = mongoose;

const favoritePostSchema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  Post: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});
favoritePostSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
const FavoritePost = model('favoritePost', favoritePostSchema);
module.exports = FavoritePost;
