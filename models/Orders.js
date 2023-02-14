const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orders: [
      {
        orderId: {
          type: String,
          required: true,
        },
        items: {
          type: Array,
          required: true,
        },
        address: {
          type: Object,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        orderStatus: {
          type: String,
          required: true,
          default: "Pending",
        },
        paymentStatus: {
          type: String,
          required: true,
          default: "Pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", OrderSchema);
