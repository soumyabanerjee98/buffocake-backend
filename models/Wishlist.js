const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  wishList: [
    {
      productId: {
        type: String,
        required: true,
      },
      productMetaTitle: {
        type: String,
        required: true,
      },
      productTitle: {
        type: String,
        required: true,
      },
      productImage: {
        type: Array,
      },
    },
  ],
});

module.exports = mongoose.model("Wishlists", WishlistSchema);
