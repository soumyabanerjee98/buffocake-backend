const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema({
  mediaPath: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
});

module.exports = mongoose.model("Carousels", CarouselSchema);
