const cuentaService = require('./cuentaService');
const logMensajesDao = require('../dao/logMensajesDao');
const LogMensajeModel = require("../models/LogMensajeModel")
const DevicesSingleton = require('../models/DevicesSingleton')

const WhatsappClientService = require('../core/WhatsappClientService');

const DEVICES = DevicesSingleton.getInstance();

const buildClient = () =>{
     return new WhatsappClientService();     
}

const getInfoCuenta = async (apiKey) => {
    
    const cuenta = await cuentaService.getCuentaInfo(apiKey);

    if(!cuenta)
        throw new Error("No existe la cuenta");
          
    return cuenta;
}


const getInstanceClient = (apiKey) => {
          
    const whatsappClient = DEVICES.get(cuenta.apiKey);

/*    if(!whatsappClient)
        throw new Error("No existe la instancia");
        */

    return whatsappClient;

}

const initSesion = async (apiKey)=>{
    
    const  cuenta  = await getInfoCuenta(apiKey);

    const instancia = getInstanceClient(apiKey);

    if(instancia){
        throw new Error("Ya existe una sesión");
    }
            
    const cliente = buildClient();

    const state =  await cliente.init();
    
    DEVICES.set(apiKey,cliente);

    return state;
          
}

const logout = async(apiKey)=>{
    console.log("@Logout cliente "+apiKey)
    
    let ret = false;

    const whatsappClient = getInstanceClient(apiKey);    

    if(whatsappClient == null){        
     
        await whatsappClient.logout();
        ret = true;
        DEVICES.delete(apiKey);
        console.log("@Sesion cerrada");
    }
  
    return ret;  
}

const enviarMensaje = async (data = {phoneNumber,message,apiKey}) =>{
    console.log("@enviarMensaje")

    const {phoneNumber,message,apiKey} = data;    
    
    const cuentaInfo = await getInfoCuenta(apiKey);

    const whatsappClient = getInstanceClient(apiKey);    

    console.log("cuenta encontrada "+JSON.stringify(cuentaInfo));

    if(!whatsappClient.getEstatus())
        throw new Error("El cliente no esta listo");

    if(!phoneNumber)
        throw new Error("El número es requerido");

    if(!message)
        throw new Error("El mensaje es requerido");
    
    
    //if(cuentaInfo.mensajes_pendientes > 0){
        console.log("Intentando enviar mensaje...");

        const result = await whatsappClient.sendMessagePhone({
            phoneNumber,
            message
        });

        //await cuentaService.actualizarNumeroMensajes(cuentaInfo.id,1,"RESTAR");

        const logMensaje = new LogMensajeModel();

        logMensaje.codigo_envio = result;
        logMensaje.creado_por = cuentaInfo.c_usuario;
        logMensaje.c_cuenta = cuentaInfo.id;
        logMensaje.mensaje = message;
        logMensaje.whatsapp = phoneNumber;        

        logMensajesDao.save(logMensaje.buildInsert());
        
        console.log("Mensaje guardado..");

        return logMensaje.buildReturn();
    /*}else{
        
        console.log("@no hay creditos");

        throw new Error("La cuenta ya no tiene mensajes disponibles...");// Error("La cuenta ya no tiene mensajes crédito.");
    }*/
}


const getEstatusCliente = (apiKey) => {
     
    const whatsappClient = getInstanceClient(apiKey);    

     whatsappClient.getEstatus()
};


module.exports = {
    enviarMensaje,getEstatusCliente,logout,initSesion
};