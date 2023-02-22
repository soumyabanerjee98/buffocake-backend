const mongoose = require("mongoose");

const CatagorySchema = new mongoose.Schema({
  catagory: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Catagories", CatagorySchema);
