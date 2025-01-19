const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const {
  Schema,
  model
} = mongoose;

// Định nghĩa các loại feedback
const typeFeedback = {
  CONTRIBUTION: 'contribute',
  ERROR_REPORT: 'errorReport',
  FEEDBACK: 'feedback',
  OTHER: 'other'
};

// Định nghĩa schema cho feedback
const feedbackSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(typeFeedback) // Sử dụng Object.values để lấy các giá trị từ đối tượng
  },
  title: String,
  content: String,
  images: String
}, {
  timestamps: true
});

// Áp dụng plugin xóa mềm
feedbackSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});

// Tạo mô hình Feedback
const Feedback = model('feedback', feedbackSchema);
module.exports = {
  Feedback,
  typeFeedback // Xuất đối tượng typeFeedback
};