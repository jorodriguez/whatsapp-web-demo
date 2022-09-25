const Joi = require('joi');


const schemaEnvioMensaje = 
    Joi.object({    
        phoneNumber : Joi.string().required(),    
        message: Joi.string().required(),
        apiKey : Joi.string().required(),
});

module.exports = {schemaEnvioMensaje}