const mongoose = require('mongoose');
const Product = require('./Product');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 255
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    bucketIds: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: Product,
        default: []
    },
    bucketAmounts: {
        type: [Number],
        default: []
    },
    creationDate: {
        type: Date,
        immutable: true,
        default: Date.now
    }
});


module.exports = mongoose.model('User', userSchema);