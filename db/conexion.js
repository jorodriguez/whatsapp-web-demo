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


const testDb = async()=>{
  console.log("process.env "+process.env);
  const test =  await knex.raw(" select current_timestamp, current_date, current_setting('TIMEZONE') ");
  console.log("HORA en DB");
  console.log(JSON.stringify(test.rows));
}

testDb();

module.exports = {
    knex
};