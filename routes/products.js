const express = require('express');
const router = express.Router();
const Product = require('../models/Product');




// Get all products
router.get('/', async (req, res) => {
    try {
        const content = await Product.find();
        res.json(content);
    }
    catch(err) {
        res.json({message: err});
    }
});

// Get a precise product
router.get('/:id', async (req, res) => {
    try {
        const content = await Product.findById(req.params.id);
        res.json(content);
    }
    catch(err) {
        res.json({message: err});
    }
});



// à virer
router.post('/', async (req, res) => {
    // Create
    const product = new Product({
        name: req.body.name,
        reference: req.body.reference,
        stock: req.body.stock,
        price: req.body.price
    });
    // Save
    try {
        const savedProduct = await product.save();
        res.send({createdProduct: product._id});
    }
    catch (err) {
        res.status(400).send(err);
    }
});




module.exports = router;