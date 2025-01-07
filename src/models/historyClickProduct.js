const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { Schema, model } = mongoose;

const historyClickProductSchema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);
historyClickProductSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const HistoryClickProduct = model(
  "historyClickProduct",
  historyClickProductSchema
);
module.exports = HistoryClickProduct;
