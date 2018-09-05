'use strict'

var mongo = require('mongoose');
var app = require('./app');

//port
var port = 3800;

//conexion a la base de datos
mongo.Promise = global.Promise;
mongo.connect('mongodb://localhost:27017/basic_social_network', { useNewUrlParser: true })
	.then(() => {
		console.log("la conexión a la base de datos se ha realizado correctamente!!!!");
		app.listen(port, () => {
			console.log("Servidor corriendo en http://localhost:"+String(port));
		});
	})
	.catch(err => console.log(err));