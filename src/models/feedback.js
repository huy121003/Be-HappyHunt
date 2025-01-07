const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { Schema, model } = mongoose;
const feedbackSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["contribute", "errorReport", "feedback", "other"],
    },
    title: String,
    content: String,
    images: String,
  },
  { timestamps: true }
);
feedbackSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Feedback = model("feedback", feedbackSchema);
module.exports = Feedback;
