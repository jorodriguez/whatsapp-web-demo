const {findAll,findOne} = require('./DaoQuery');
const DaoModel = require("../dao/DaoModel");
const cCuentaDao = new DaoModel("c_cuenta");


const getInfoCuenta = async(apiKey)=>{
    console.log("@getInfoCuenta");

    return await findOne("select * from c_cuenta where api_key = ? and activo = true ",[apiKey]);
}

const actualizarNumeroMensajes = async (cCuenta,numeroMensaje,afectacion) => {
    console.log("@descontarMensaje");
    
    const signo = afectacion == 'AGREGAR' ? ' + ':' - ';
   
    //cCuentaDao.update(cCuenta,{mensajes_pendientes:}) 
    return await  cCuentaDao.getKnex().raw(`update c_cuenta set mensajes_pendientes = mensajes_pendientes ${signo} ?,modificado = current_timestamp where id = ?`,[numeroMensaje,cCuenta]);
    
}

module.exports = {getInfoCuenta,actualizarNumeroMensajes}