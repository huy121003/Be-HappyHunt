const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const postSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category'
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'account'
  },
  name: String,
  price: Number,
  description: String,
  images: [String],
  status: {
    type: String,
    enum: ['SELLING', 'SOLD', 'REJECTED', 'WAITING'],
    default: 'WAITING'
  },
  clickCount: Number,
  attribute: [{
    name: String,
    value: String,
    unit: String
  }],
  url: String,
  address: String
}, {
  timestamps: true
});
postSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const Post = model('post', postSchema);
module.exports = Post;