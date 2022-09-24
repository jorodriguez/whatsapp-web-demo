const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5001;

const version = "1";

app.use(bodyParser.json());

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Origin,Accept,Authorization,x-access-token'); // If needed	
	res.setHeader('Access-Control-Allow-Credentials', true); // If needed
	next();
});

app.get('/root', (request, response) => {	
	response.json({ info: `running dog v${version} (env:${process.env.ENV})` });
});

app.listen(port, () => {
	console.log(`App corriendo en el puerto ${port} ${version} (env:${process.env.ENV})`);
});


module.exports = app;