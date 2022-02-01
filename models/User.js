const mongoose = require('mongoose');
const checkEmail = require('../utils/validate');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: [checkEmail, "Please provide valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
 }
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
}

module.exports = mongoose.model('User', UserSchema);