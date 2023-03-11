const mongoose = require("mongoose");

const NavbarSchema = new mongoose.Schema({
  catagory: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("Navbars", NavbarSchema);
