const dotenv = require('dotenv').config();
/*
ENV=LOCAL
PORT:5000
DATABASE_NAME=sqtwgjks
HOST_DB=jelani.db.elephantsql.com
USER_DB=sqtwgjks
PORT_DB=5432
PASSWORD_DB=MkgsTqLiZgpzLrWOioxFWoRxa8asoB5g
TOKEN_SALT=supersecretlocal*/

/*
    Uso para testing falta configurar el ambiente
*/
module.exports = {
    ENV: process.env.ENV || 'local_development',    
    PORT: process.env.PORT || 5000,
    USER_DB: process.env.USER_DB || 'sqtwgjks',
    HOST_DB: process.env.HOST_DB || 'jelani.db.elephantsql.com',
    DATABASE_NAME:process.env.DATABASE_NAME || 'sqtwgjks',
    PASSWORD_DB:process.env.PASSWORD_DB ||'MkgsTqLiZgpzLrWOioxFWoRxa8asoB5g',
    PORT_DB : process.env.PORT_DB ||5432,      
    TOKEN_SALT: process.env.TOKEN_SALT || '@supernoVa'
};