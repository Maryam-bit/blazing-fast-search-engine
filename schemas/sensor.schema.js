const Joi = require('joi')

const sensorSchema = { 
  duration_data: Joi.object().keys({
    startTime: Joi.string().isoDate().required(),
    endTime: Joi.string().isoDate().required(),
  }),
};

module.exports = sensorSchema;