const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT;

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please Enter all the valid fields");
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    let hashedPassword = await bcrypt.hash(password, Number(bcryptSalt));

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } else {
    res.status(400);
    throw new Error("User does not exists! Please signup first.");
  }
});

module.exports = { resetPassword };
