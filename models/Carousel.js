const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema({
  mediaPath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Carousels", CarouselSchema);
