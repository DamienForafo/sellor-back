const router = require("express").Router();
const User = require("../models/User");
const { registerValidate, loginValidate } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER a new user
router.post("/register", async (req, res) => {
  // Validate before saving
  const { error } = registerValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Check if email is available
  const emailExists = await User.exists({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already used");
  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // Create
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  // Save
  try {
    const savedUser = await user.save();
    res.send({ createdUser: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN a user
router.post("/login", async (req, res) => {
  // Validate before logging in
  const { error } = loginValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Check if email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  // Check the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  // All good : create and assign a token
  const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
  res
    .header("auth-token", token)
    .send({ token: token, _id: user.id, email: req.body.email }); // ("auth-token" is arbitrary)
});

// GET LoggedIn user
router.get("/user", async (req, res) => {
  res.send({ data: "hello" });
  // try {
  //     const content = await User.find();
  //     res.json(content);
  // }
  // catch(err) {
  //     res.json({message: err});
  // }
});

router.post("/logout", async (req, res) => {
  res.send("hello");
});
module.exports = router;
