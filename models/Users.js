const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false,
  },
  superAdmin: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Users", UserSchema);
