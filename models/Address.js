const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  address: [
    {
      receiverName: {
        type: String,
        required: true,
      },
      receiverContact: {
        type: String,
        required: true,
      },
      house: {
        type: String,
      },
      street: {
        type: String,
        required: true,
      },
      pin: {
        type: String,
        required: true,
      },
      favorite: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("Addresses", AddressSchema);
