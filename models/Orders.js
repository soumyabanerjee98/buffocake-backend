const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  txnId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  shippingAddress: {
    type: Object,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  discount: {
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
  orderTimeStamp: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Orders", OrderSchema);
