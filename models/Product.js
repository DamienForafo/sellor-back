const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    reference: {
        type: String,
        required: true,
        min: 10,
        max: 10
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('Product', productSchema);