const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: String,
        required: true,
      },
      productImage: {
        type: String,
        default: null,
      },
      qty: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      flavour: {
        type: String,
        required: true,
      },
      custom: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      allergy: {
        type: String,
        required: true,
      },
      del_date: {
        type: String,
        required: true,
      },
      del_time: {
        type: String,
        required: true,
      },
      subTotal: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Carts", CartSchema);
