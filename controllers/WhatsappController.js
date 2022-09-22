const path = require("path");

const WhatsappClientService = require('../service/WhatsappClientService')

const whatsappClient = new WhatsappClientService();

const enviarMensaje = async (request, response) => {
    try {
        
        const { phoneNumber,message } = request.body;

        console.log("try to send "+phoneNumber+" msg "+message);

        const result = await whatsappClient.sendMessagePhone({
                            phoneNumber,
                            message
                        })
        
        response.status(200).json(result);

    } catch (e) {
        console.log("ERROR "+e);
        response.status(400).json({status:false, ex : e });
    }
}

const getQr = async (request, response) => {
    console.log("@getQr");
    try {
        
        //const {phoneNumber,message} = request.body; //por empresa

        //await whatsappClient.generateImageQr();
        
        //const pathFile = path.resolve('../external_resource/qr.svg')

        if(whatsappClient.getEstatus()){
            response.sendFile(path.join(__dirname,'../external_resource','qr.svg'));
        }else{
            response.send("Expere un momento... refresca en 10 segundos");
        }      
        
        
    } catch (e) {
        console.log("ERROR "+e)
        response.status(400).json({status:false, ex : e });
    }
}

module.exports = {enviarMensaje,getQr};