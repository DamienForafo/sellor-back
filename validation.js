const joi = require('@hapi/joi');


const registerValidate = data => {
    const registerSchema = joi.object({
        name: joi.string().min(1).max(255).required(),
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(6).max(1024).required(),
        bucketIds: joi.array(),
        bucketAmounts: joi.array()
    });
    return registerSchema.validate(data);
};

const loginValidate = data => {
    const registerSchema = joi.object({
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(6).max(1024).required()
    });
    return registerSchema.validate(data);
};


module.exports = {
    'registerValidate': registerValidate,
    'loginValidate': loginValidate
};