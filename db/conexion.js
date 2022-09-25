const Pool = require('pg').Pool;
const dotenv = require('dotenv');
dotenv.config();
const configEnv = require('../config/configEnv');

console.log("================ INIT PARAMS DB ===============");
console.log(`USER ${configEnv.USER_DB}`);
console.log(`HOST ${configEnv.HOST_DB}`);
console.log(`DATABASE_NAME ${configEnv.DATABASE_NAME}`);
console.log(`PASSWORD_DB ${configEnv.PASSWORD_DB}`);
console.log(`PORT_DB ${configEnv.PORT_DB}`);


const knex = require('knex')({
    client: 'pg',
    connection: {
      host : configEnv.HOST_DB,
      port : configEnv.PORT_DB,
      user :  configEnv.USER_DB,
      password :  configEnv.PASSWORD_DB,
      database :configEnv.DATABASE_NAME,
    },
    pool: { min: 0, max: 4 }
  });


module.exports = {
    knex
};