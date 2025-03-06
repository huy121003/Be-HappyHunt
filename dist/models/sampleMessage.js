const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;
const sampleMessageSchema = new Schema({
  message: String,
  seller: {
    messageVn: String,
    messageEn: String
  },
  buyer: {
    messageVn: String,
    messageEn: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category'
  }
}, {
  timestamps: true
});
sampleMessageSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});
const SampleMessage = model('sampleMessage', sampleMessageSchema);
module.exports = SampleMessage;