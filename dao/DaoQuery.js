const { knex } = require('../db/conexion');
const { Exception } = require('../exception/exeption');

findAll = async (sql,params)=>{
    console.log("@findAll}");
    
    if(!sql) throw Exception('Sql is empty');

    return await knex.raw(sql,params);
}

findOne = async (sql,params)=>{
    
    console.log("@findOne");

    if(!sql) throw Exception('Sql is empty');

    console.log("SQL "+sql);
    console.log("PARAMS "+params);

    const result = await knex.raw(sql,params);

    const row = (result && result.rowCount > 0) && result.rows[0];
    
    //console.log(JSON.stringify(rows));

    //return (rows && rows.length > 0) && rows[0]
    return row;
}


module.exports = {findAll,findOne};