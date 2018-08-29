'use strict'
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user.js');

function home(req, res){
	res.status(200)
	.send({
		message: 'pruebas en el servidor de nodeJS'
	});
}

function save(req, res){
	var params = req.body;
	var user = new User();

	if( params.name &&
		params.surname &&
		params.email &&
		params.password &&
		params.nick){

		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email;
		user.password = bcrypt.hash(params.password, null, null, (err, hash) =>{
			user.password = hash;
			user.save((err, User) => {
				if(err) 
					return res.status(500)
								.send({
									message: err.message
								});
				if (User){
					return res.status(200)
								.send({
									user: User
								});
				}else{
					res.status(404)
						.send({
							message: 'no se ha registrado el usuario'
						});
				}
			});
		});
		user.nick = params.nick;

	}else{
		res.status(200)
			.send({
				message:'rellena todos los campos'
			})
	}
}

module.exports = { home}