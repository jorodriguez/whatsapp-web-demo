const {findAll,findOne} = require('./DaoQuery');
const DaoModel = require("../dao/DaoModel");
const logMensajeDao = new DaoModel("log_mensaje");

const save = async(data)=>{

    console.log("@save Message");
    
    return await logMensajeDao.insert(data);
}

module.exports = {save};