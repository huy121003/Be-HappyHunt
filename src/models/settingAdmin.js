const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { Schema, model } = mongoose;
const settingAdminSchema = new Schema(
  {
    limitProduct: Number,
    timeExpired: Number,
    minImageProduct: Number,
    maxImageProduct: Number,
    timeLogout: Number,
    spamMessageCount: Number,
  },
  { timestamps: true }
);
settingAdminSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const SettingAdmin = model("settingAdmin", settingAdminSchema);
module.exports = SettingAdmin;
