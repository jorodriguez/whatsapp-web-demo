const {findAll,findOne} = require('./DaoQuery');
const DaoModel = require("../dao/DaoModel");
const cCuentaDao = new DaoModel("c_cuenta");


const getInfoCuenta = async(apiKey)=>{
    console.log("@getInfoCuenta");

    return await findOne("select * from c_cuenta where api_key = ? and activo = true ",[apiKey]);
}


const actualizarSesion = async (data = {cCuenta,sesionData,qr}) => {
    console.log("@actualizarSesion");

    const  {cCuenta,sesionData = null,qr} = data;

    console.log(`cCuenta ${cCuenta} sesionData ${sesionData}  qr ${qr}`);
    
    return await  cCuentaDao
                    .getKnex()
                    .raw(
                        `update c_cuenta set sesion_data = ?,qr = ?, modificado = current_timestamp where id = ?`
                        ,[sesionData,qr,cCuenta]
                    );    
}

const actualizarNumeroMensajes = async (cCuenta,numeroMensaje,afectacion) => {
    console.log("@descontarMensaje");
    
    
    const signo = afectacion == 'AGREGAR' ? ' + ':' - ';
   
    //cCuentaDao.update(cCuenta,{mensajes_pendientes:}) 
    return await  cCuentaDao.getKnex().raw(`update c_cuenta set mensajes_pendientes = mensajes_pendientes ${signo} ?,modificado = current_timestamp where id = ?`,[numeroMensaje,cCuenta]);    
}

module.exports = {getInfoCuenta,actualizarNumeroMensajes,actualizarSesion}