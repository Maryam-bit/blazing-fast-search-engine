const Joi = require('joi'); 

const validator = (schema) => {
    return async (req, res, next) => {
        try {
            const validated = await schema.validateAsync(req.body, {
                abortEarly: false
            })
            req.body = validated
            next()
        } catch (error) {
            if(error.isJoi) 
                return res.status(403).json({error: error})
        }
    }
};

module.exports = validator;