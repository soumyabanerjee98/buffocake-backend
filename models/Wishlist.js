const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  wishList: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("Wishlists", WishlistSchema);
