const mongoose = require("mongoose");

const CatagorySchema = new mongoose.Schema({
  catagory: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  subCatagory: [
    {
      subCatagoryId: {
        type: String,
        required: true,
      },
      subCatagoryName: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Catagories", CatagorySchema);
