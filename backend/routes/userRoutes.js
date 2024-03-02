const express = require("express");
const { registerUser, authUser } = require("../controllers/userControllers");
const { resetPassword } = require("../controllers/passwordControllers");

const router = express.Router();

router.route("/register").post(registerUser);

router.post("/login", authUser);

router.put("/reset-password", resetPassword);

//router.post("/reset-password", resetPassword);

module.exports = router;
