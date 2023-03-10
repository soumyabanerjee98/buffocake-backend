const mongoose = require("mongoose");

const PincodeSchema = new mongoose.Schema({
  pincodes: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Pincodes", PincodeSchema);
