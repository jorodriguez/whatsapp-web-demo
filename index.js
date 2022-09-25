const app = require('./routes/app');
const whatsasppRoute = require('./routes/whatsasppRoute');

app.use('/whatsapp',whatsasppRoute);

console.log("----------- API READY ---------------");

More