const express = require('express');
const router = express.Router();
const User = require('../models/User');
const tools = require('../tools.js');
const getTool = tools.getTool;




// GET

// Get all users
router.get('/', async (req, res) => getTool(res, User.find().limit(5)));

// Get a precise user
router.get('/:id', async (req, res) => getTool(res, User.findById(req.params.id)));