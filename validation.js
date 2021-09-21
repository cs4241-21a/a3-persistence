//validating user
const Joi = require('@hapi/joi');

const regValidation = (data) => {
const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required()
});
return schema.validate(data);
}

const logValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
    }

module.exports.regValidation = regValidation;
module.exports.logValidation = logValidation;