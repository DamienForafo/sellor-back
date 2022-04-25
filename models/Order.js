const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: User,
        required: true
    },
    creationDate: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    products: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: Product,
        required: true
    },
    productAmounts: {
        type: [Number],
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('Order', orderSchema);