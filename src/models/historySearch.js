const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { Schema, model } = mongoose;
const historySearchSchema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    keyword: [String],
  },
  { timestamps: true }
);
historySearchSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const HistorySearch = model("historySearch", historySearchSchema);
module.exports = HistorySearch;
