
//const genericDao = require('./genericDao');
const { knex } = require('../db/conexion');
const { findOne } = require('./DaoQuery');
const { Exception } = require('../exception/exeption');

class Dao{
    
    constructor(modelName){
        this.modelName = modelName;

        this.validar = () => { if (this.modelName == '') { throw "La tabla no esta definida"; } };

        this.insert = async (modelData) => {
            console.log("@insert " + this.modelName);
            console.log("modelData = "+JSON.stringify(modelData));
            return await knex(this.modelName).insert(modelData).returning('*');

        };

        this.update = async (id, modelData) => {
            return await knex(this.modelName).update(modelData).where("id", id).returning('*');
        };

        this.remove = async (id, genero) => {
            return await knex(this.modelName).update({ fecha_modifico: '(getDate()+getHora())::timestamp', modifico: genero, eliminado: true }).where("id", id);
        };

        this.findAll = async () => {
            console.log("@findAll " + this.modelName);
            return await knex.select('*').from(this.modelName).where('eliminado', false);
        };

        this.findById = async (id) => {
            console.log("@findById " + this.modelName);
            
            return await findOne(`SELECT * FROM ${this.modelName} WHERE  id =$1 AND ELIMINADO = FALSE`,[id]);
        };

        this.getInstanceModel = () => {
            return knex(this.modelName);
        };

        this.getSelectFrom = () => {
            return knex.select('*').from(this.modelName);
        };

        this.execRaw = () => {
            return knex.raw;
        };

        this.getKnex = () => knex;
    }      

}


module.exports = Dao;