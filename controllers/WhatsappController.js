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
    console.log("@getQr");
    try {

        const { apiKey } = request.params;

        if(!apiKey)
            throw new Error("El ApiKey es requerido..");
         
        let clienteIniciado = whatsappService.getInstanceClient(apiKey);

        if(!clienteIniciado){
            console.log("Cliente no iniciado----> se procede a iniciar la instancia");
            clienteIniciado = await whatsappService.iniciarCliente(apiKey);
        }

        //obtener info del cliente                   
        //if(whatsappService.estaPermitidoLeerQr(apiKey)){
        if(clienteIniciado.clienteOk){

            console.log("--> getQr para leer");
            console.log(clienteIniciado.qr)
            //response.send(clienteIniciado.qr);
           response.sendFile(path.join(__dirname,'../external_resource',`qr_${apiKey}.svg`));

        }else{

            let textRet = clienteIniciado != null ? `La sesion esta iniciada y lista para enviar mensajes `:`Espere un momento...`;
            
            response.send(textRet);

        }   

    } catch (e) {
        console.log("Error "+e);
        response.status(400).json({status:false, ex :  `${e}` });
    }
}


/*
const getHtmlQr = async (request, response) => {
    console.log("@getHtmlQr");
    try {

        const { apiKey } = request.params;

        if(!apiKey)
            throw new Error("El ApiKey es requerido..");
 

        let cliente = null;
        
        const clienteIniciado = whatsappService.getInstanceClient(apiKey);

        if(!clienteIniciado){
            console.log("Cliente no iniciado----> se procede a iniciar la instancia");
            cliente = await whatsappService.iniciarCliente(apiKey);
        }

        //obtener info del cliente                   
        if(whatsappService.estaPermitidoLeerQr(apiKey)){
            console.log("--> getQr para leer");
            response.sendFile(path.join(__dirname,'../external_resource',`qr_${apiKey}.svg`));

        }else{

            let textRet = cliente.sesionIniciada ? `La sesion esta iniciada y lista para enviar mensajes `:`Espere un momento...`;
            
            response.send(textRet);

        }   

    } catch (e) {
        console.log("Error "+e);
        response.status(400).json({status:false, ex :  `${e}` });
    }
}
*/

const logout = async (request, response) => {
    console.log("@@LOGOUT");
    try {

        const { apiKey } = request.body;
        
        if(whatsappService.getEstatusCliente(apiKey) ){

            await whatsappService.logout(apiKey);
            
            response.status(200).json({status:true,message:"Sesión Cerrada", ex : null });

        }else{

            response.status(400).json({status:false,message:"No existe la sesión", ex : null });            
        }   

    } catch (e) {
        response.status(400).json({status:false, ex :  `${e}` });
    }
}




module.exports = {enviarMensaje,getQr,logout};