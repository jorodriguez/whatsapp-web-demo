const cuentaService = require('./cuentaService');
const logMensajesDao = require('../dao/logMensajesDao');
const LogMensajeModel = require("../models/LogMensajeModel")

const WhatsappClientService = require('../core/WhatsappClientService');

const whatsappClient = new WhatsappClientService();

const enviarMensaje = async (data = {phoneNumber,message,apiKey}) =>{
    console.log("@enviarMensaje")

    const {phoneNumber,message,apiKey} = data;    
    
    const cuentaInfo = await cuentaService.getCuentaInfo(apiKey);

    console.log("cuenta encontrada "+JSON.stringify(cuentaInfo));

    if(!phoneNumber)
        throw new Error("El número es requerido");

    if(!message)
        throw new Error("El mensaje es requerido");

    if(!cuentaInfo)
        throw new Error("No existe el api key");
    
    if(cuentaInfo.mensajes_pendientes > 0){
        console.log("Intentando enviar mensaje...");

        const result = await whatsappClient.sendMessagePhone({
            phoneNumber,
            message
        });

        await cuentaService.actualizarNumeroMensajes(cuentaInfo.id,1,"RESTAR");

        const logMensaje = new LogMensajeModel();

        logMensaje.codigo_envio = result;
        logMensaje.creado_por = cuentaInfo.c_usuario;
        logMensaje.c_cuenta = cuentaInfo.id;
        logMensaje.mensaje = message;
        logMensaje.whatsapp = phoneNumber;        

        logMensajesDao.save(logMensaje.buildInsert());
        
        console.log("Mensaje guardado..");

        return logMensaje.buildReturn();
    }else{
        
        console.log("@no hay creditos");

        throw new Error("La cuenta ya no tiene mensajes disponibles...");// Error("La cuenta ya no tiene mensajes crédito.");
    }
}


const getEstatusCliente = () => whatsappClient.getEstatus();


module.exports = {
    enviarMensaje,getEstatusCliente
};