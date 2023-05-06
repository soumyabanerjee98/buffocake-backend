const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  usedUser: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Coupons", CouponSchema);
