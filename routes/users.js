const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const { registerValidate } = require("../validation");


// à modif pour voir que son profil
router.get("/", async (req, res) => {
  try {
    const content = await User.find();
    res.json(content);
  } catch (err) {
    res.json({ message: err });
  }
});

// voir mon profil
router.get("/me", async (req, res) => {
  try {
    const content = await User.findById(req.user._id);
    res.json(content);
  } catch (err) {
    res.json({ message: err });
  }
});

// à virer
router.get("/:id", async (req, res) => {
  try {
    const content = await User.findById(req.params.id);
    res.json(content);
  } catch (err) {
    res.json({ message: err });
  }
});

// Update the current user
router.put("/", async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const rawBody = req.body;
  let toUpdate = {
    name: user.name,
    email: user.email,
    password: user.password,
    bucketIds: user.bucketIds,
    bucketAmounts: user.bucketAmounts,
  };
  for (let k in rawBody) {
    switch (k) {
      case "name":
        toUpdate.name = rawBody.name;
        break;
      case "email":
        const emailExists = await User.exists({ email: rawBody.email });
        if (emailExists) return res.status(400).send("Email already used");
        toUpdate.email = rawBody.email;
        break;
      case "password":
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawBody.password, salt);
        toUpdate.password = hashedPassword;
      case "bucketIds":
        toUpdate.bucketIds = rawBody.bucketIds;
        break;
      case "bucketAmounts":
        toUpdate.bucketAmounts = rawBody.bucketAmounts;
        break;
    }
  }


  // Check the bucket
  const toUpdateKeys = Object.keys(toUpdate);
  if (
    (toUpdateKeys.includes("bucketIds") && toUpdate.bucketIds != null) ||
    (toUpdateKeys.includes("bucketAmounts") && toUpdate.bucketAmounts != null)
  ) {
    if (
      (toUpdateKeys.includes("bucketIds") &&
        !toUpdateKeys.includes("bucketAmounts")) ||
      (toUpdateKeys.includes("bucketAmounts") &&
        !toUpdateKeys.includes("bucketIds")) ||
      (toUpdateKeys.includes("bucketAmounts") &&
        toUpdateKeys.includes("bucketIds") &&
        toUpdate.bucketAmounts != null &&
        toUpdate.bucketIds != null &&
        toUpdate.bucketIds.length !== toUpdate.bucketAmounts.length)
    )
      return res
        .status(400)
        .send("Each bucketId needs its amount and vice-versa");
    for (let i = 0; i < toUpdate.bucketIds.length; i++) {
      let prodId = toUpdate.bucketIds[i];
      let prodAmount = toUpdate.bucketAmounts[i];
      let prod = await Product.findOne({ _id: prodId });
      let prodStock = prod.stock;
      if (toUpdate.prodAmount > prodStock)
        return res
          .status(403)
          .send(
            `The amount ${prodAmount} of product ${prodId} is not available`
          );
    }
  }
  // Check the schema
  const { error } = registerValidate(toUpdate);
  if (error) return res.status(400).send(error.details[0].message);
  // Save
  for (let param in toUpdate) user[param] = toUpdate[param];
  try {
    const savedUser = await user.save();
    res.send({ updatedUser: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a user by his id
router.delete("/", async (req, res) => {
  try {
    const deleted = await User.deleteOne({ _id: req.user._id });
    res.send({ deletedUser: req.user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
