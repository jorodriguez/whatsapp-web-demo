const cuentaService = require('./cuentaService');
const logMensajesDao = require('../dao/logMensajesDao');
const LogMensajeModel = require("../models/LogMensajeModel")
const DevicesSingleton = require('../models/DevicesSingleton')

const WhatsappClientService = require('../core/WhatsappClientService');

const DEVICES = DevicesSingleton.getInstance();

const buildClient = (data = { sesionData, idCuenta, contryCode }) => {

    return new WhatsappClientService({...data });

}

const getInfoCuenta = async(apiKey) => {

    const cuenta = await cuentaService.getCuentaInfo(apiKey);

    if (!cuenta)
        throw new Error("No existe la cuenta");

    return cuenta;
}


const getInstanceClient = (apiKey) => {

    const whatsappClient = DEVICES.get(apiKey);

    return whatsappClient;

}

const iniciarCliente = async(apiKey) => {

    const cuenta = await getInfoCuenta(apiKey);

    const instancia = getInstanceClient(cuenta.api_key);

    if (instancia) {
        throw new Error("Ya existe una sesión");
    }

    const cliente = buildClient({ sesionData: null, contryCode: cuenta.contry_code, apiKey: cuenta.api_key });

    console.log(`iniciando cliente ${cuenta.api_key}.....`)

    const state = await cliente.init();

    console.log("iniciado " + JSON.stringify(state));



    //guardar sesion
    await cuentaService.actualizarSesion({ cCuenta: cuenta.id, sesionData: state.sesionData, qr: state.qr });

    DEVICES.set(apiKey, cliente);

    return cliente;

}

const logout = async(apiKey) => {
    console.log("@Logout cliente " + apiKey)

    let ret = false;

    const instancia = getInstanceClient(apiKey);

    if (instancia) {
        await instancia.logout();
        ret = true;
        DEVICES.delete(apiKey);
        const cuenta = await getInfoCuenta(apiKey);
        await cuentaService.actualizarSesion({ cCuenta: cuenta.id, sesionData: null, qr: null });
        console.log("@Sesion cerrada");
    } else { console.log("No existe la instancia para logout") }

    return ret;
}

const enviarMensaje = async(data = { phoneNumber, message, apiKey }) => {
    console.log("@enviarMensaje")

    const { phoneNumber, message, apiKey } = data;

    const cuentaInfo = await getInfoCuenta(apiKey);

    const whatsappClient = getInstanceClient(apiKey);

    console.log("cuenta encontrada " + JSON.stringify(cuentaInfo));

   

    if (!whatsappClient || !whatsappClient.getEstatus())
        throw new Error("El cliente no esta listo vuelve a escanear el QR (1)");

    if (!whatsappClient.getEstatus())
    throw new Error("El cliente no esta listo vuelve a escanear el QR (2)");

    if (!phoneNumber)
        throw new Error("El número es requerido");

    if (!message)
        throw new Error("El mensaje es requerido");


    //if(cuentaInfo.mensajes_pendientes > 0){
    console.log("Intentando enviar mensaje...");

    const realPhone = `${cuentaInfo.contry_code}${phoneNumber}`;

    const result = await whatsappClient.sendMessagePhone({
        phoneNumber: realPhone,
        message
    });

    //await cuentaService.actualizarNumeroMensajes(cuentaInfo.id,1,"RESTAR");

    const logMensaje = new LogMensajeModel();

    logMensaje.codigo_envio = result;
    logMensaje.creado_por = cuentaInfo.c_usuario;
    logMensaje.c_cuenta = cuentaInfo.id;
    logMensaje.mensaje = message;
    logMensaje.whatsapp = phoneNumber;

    // logMensajesDao.save(logMensaje.buildInsert());

    console.log("Mensaje guardado..");

    return logMensaje.buildReturn();
    /*}else{
        
        console.log("@no hay creditos");

        throw new Error("La cuenta ya no tiene mensajes disponibles...");// Error("La cuenta ya no tiene mensajes crédito.");
    }*/
}


const getEstatusCliente = (apiKey) => {
    console.log("@getEstatusCliente " + apiKey);
    const whatsappClient = getInstanceClient(apiKey);

    //    if(!whatsappClient)
    //      throw new Error("No existe el cliente o aun no inicia sesión");

    return whatsappClient ? whatsappClient.getEstatus() : null;
};


const estaPermitidoLeerQr = (apiKey) => {
    console.log("@estaPermitidoLeerQr " + apiKey);
    const whatsappClient = getInstanceClient(apiKey);
    return whatsappClient ? whatsappClient.estaPermitidoLeerQr() : false;
};

const imprimirSesiones = () => {
    console.log("@Imprimir sesiones");
    const DEVICES = DevicesSingleton.getInstance();

    if (DEVICES.size == 0)
        console.log("No hay sesiones abiertas");
    else
        for (const [key, value] of DEVICES.entries()) {
            console.log(`${key} = ${value}`);
        }

}


module.exports = {
    enviarMensaje,
    getEstatusCliente,
    logout,
    iniciarCliente,
    imprimirSesiones,
    estaPermitidoLeerQr,
    getInstanceClient
};