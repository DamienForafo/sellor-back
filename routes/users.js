const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {registerValidate} = require('../validation');




// GET

// Get all users
router.get('/', async (req, res) => {
    try {
        const content = await User.find().limit(5);
        res.json(content);
    }
    catch(err) {
        res.json({message: err});
    }
});

// Get a precise user
router.get('/:id', async (req, res) => {
    try {
        const content = await User.findById(req.params.id);
        res.json(content);
    }
    catch(err) {
        res.json({message: err});
    }
});

// Update the current user
router.put('/', async (req, res) => {
    const user = await User.findOne({_id: req.user._id});
    const rawBody = req.body;
    let toUpdate = {
        name: user.name,
        email: user.email,
        password: user.password
    };
    for (let k in rawBody) {
        switch (k) {
            case 'name':
                toUpdate.name = rawBody.name;
                break;
            case 'email':
                const emailExists = await User.exists({email: rawBody.email});
                if (emailExists) return res.status(400).send('Email already used');
                toUpdate.email = rawBody.email;
                break;
            case 'password':
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(rawBody.password, salt);
                toUpdate.password = hashedPassword;
        }
    }
    const {error} = registerValidate(toUpdate);
    if (error) return res.status(400).send(error.details[0].message);
    for (let param in toUpdate) user[param] = toUpdate[param];
    try {
        const savedUser = await user.save();
        res.send({updatedUser: user._id});
    }
    catch (err) {
        res.status(400).send(err);
    }
});

// Delete a user by his id
router.delete('/', async (req, res) => {
    try {
        const deleted = await User.deleteOne({_id: req.user._id});
        res.send({deletedUser: req.user._id});
    }
    catch (err) {
        res.status(400).send(err);
    }
});





module.exports = router;