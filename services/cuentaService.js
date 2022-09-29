const cuentaDao = require('../dao/cuentaDao');


module.exports = {
    getCuentaInfo:cuentaDao.getInfoCuenta,
    actualizarNumeroMensajes:cuentaDao.actualizarNumeroMensajes,
    actualizarSesion:cuentaDao.actualizarSesion,
};