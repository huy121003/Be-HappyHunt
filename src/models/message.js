const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { Schema, model } = mongoose;
const messageSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "Account" },
    buyer: { type: Schema.Types.ObjectId, ref: "Account" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    url: String,
    content: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "Account" },
        message: String,
        images: String,
        read: { type: Boolean, default: false },
        timeSend: Date,
        timeRead: Date,
      },
    ],
  },
  { timestamps: true }
);
messageSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Message = model("message", messageSchema);
module.exports = Message;
