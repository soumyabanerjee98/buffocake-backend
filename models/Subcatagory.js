const mongoose = require("mongoose");

const SubcatagorySchema = new mongoose.Schema({
  subCatagory: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SubCatagories", SubcatagorySchema);
