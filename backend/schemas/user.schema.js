const Joi = require('joi')

const userSchema = { 
  registration: Joi.object().keys({ 
    user_name: Joi.string().alphanum().min(5).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).max(15).required()
  }),
  login: Joi.object().keys({
    user_name: Joi.string().alphanum().min(5).max(15).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).max(15).required()
  }),
  update: Joi.object().keys({
    user_name: Joi.string().alphanum().min(5).max(15).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().alphanum().min(6).max(15).optional()
  })
};

module.exports = userSchema;