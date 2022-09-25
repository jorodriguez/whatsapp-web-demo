const path = require("path");

const whatsappService = require("../services/whatsappService");

const { schemaEnvioMensaje } = require("../schemas/SchemaMensajes");

const enviarMensaje = async (request, response) => {
    try {
        
        const data = { phoneNumber,message,apiKey } = request.body;

        console.log(JSON.stringify(data));

        await schemaEnvioMensaje.validateAsync(data);

        console.log("try to send "+phoneNumber+" msg "+message+" "+apiKey);

        const result = await whatsappService.enviarMensaje({phoneNumber,message,apiKey});

        /*const result = await whatsappClient.sendMessagePhone({
                            phoneNumber,
                            message
                        })*/
        
        response.status(200).json({status:true, mensaje : result, });

    } catch (ex) {
        console.log("EXEPCION "+ ex);
        response.status(400).json({status:false, mensaje : `${ex}` });
    }
}

const getQr = async (request, response) => {
    try {
        
        if(! whatsappService.getEstatusCliente() ){
            response.sendFile(path.join(__dirname,'../external_resource','qr.svg'));
        }else{
            response.send("Expere un momento... refresca en 10 segundos");
        }   

    } catch (e) {
        response.status(400).json({status:false, ex : e });
    }
}

module.exports = {enviarMensaje,getQr};