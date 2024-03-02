const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT;

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
  this.password = hash;

  //const salt = await bcrypt.genSalt(15);
  //this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
