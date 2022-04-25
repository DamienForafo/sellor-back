const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Get all orders
router.get("/", async (req, res) => {
  try {
    const content = await Order.find({
      user: req.user._id,
    });
    res.json(content);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get a precise order
router.get("/:id", async (req, res) => {
  try {
    const content = await Order.findOne({
      user: req.user._id,
      _id: req.params.id,
    });
    res.json(content);
  } catch (err) {
    res.json({ message: err });
  }
});

/* Validate the bucket (empty it),
 * decrement the bought products
 * and create the order
 */
router.post("/", async (req, res) => {
  let user = await User.findById(req.user._id);
  /* Get all the bucket's products
   * and check if the amounts are still available
   */
  let prods = [];
  for (let i = 0; i < user.bucketIds.length; i++) {
    let prodId = user.bucketIds[i];
    let prodAmount = user.bucketAmounts[i];
    let prod = await Product.findById(prodId);
    let prodStock = prod.stock;
    if (user.prodAmount > prodStock)
      return res
        .status(403)
        .send(`The amount ${prodAmount} of product ${prodId} is not available`);
    prods.push({
      prod: prod,
      amount: prodAmount,
    });
  }
  // Create the order
  const order = new Order({
    user: req.user._id,
    products: user.bucketIds,
    productAmounts: user.bucketAmounts,
    totalPrice: prods.reduce((t = 0, p) => {
      return t + p.prod.price * p.amount;
    }, 0),
  });
  try {
    // Save the order
    const savedOrder = await order.save();
    // Decrement each product stock
    for (let p of prods) {
      let prod = p.prod;
      let prodAmount = p.amount;
      prod.stock -= prodAmount;
      let decrementedProd = await prod.save();
    }
    // Empty the user's bucket
    user.bucketIds = [];
    user.bucketAmounts = [];
    const modifiedUser = await user.save();
    res.send({ createdOrder: order._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
