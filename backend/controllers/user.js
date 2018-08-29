'use strict'
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user.js');

var jwt = require('../services/jwt');

var pagination = require('mongoose-pagination');

//metodo de prueba
function home(req, res){
	res.status(200)
	.send({
		message: 'pruebas en el servidor de nodeJS'
	});
}

//registro
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
		user.nick = params.nick;
		user.role = 'ROLE_USER',
		user.image = null,

		User.find({ $or: [
			{email: user.email.toLowerCase()},
			{nick: user.nick.toLowerCase()}
			]}).exec((err, users) => {
				if(err)
					return res.status(500)
								.send({
									message:'Error en la petición de usuario'
								});
				if(users && users.length >= 1){
					return res.status(200)
								.send({
									message:'el usuario que intenta registrar ya existe'
								});
				}else{
					user.password = bcrypt.hash(params.password, null, null, (err, hash) =>{
						user.password = hash;
						user.save((err, user) => {
							if(err) 
								return res.status(500)
											.send({
												message: err.message
											});
							if (user){
								return res.status(200)
											.send({
												user: user
											});
							}else{
								res.status(404)
									.send({
										message: 'no se ha registrado el usuario'
									});
							}
						});
					});
				}
			});

					

	}else{
		res.status(200)
			.send({
				message:'rellena todos los campos'
			})
	}
}

//login
function login(req, res){
	var params = req.body;

	var password = params.password;
	var email = params.email;

	User.findOne({email:email}, (err, user) => {
		if(err)
			return res.status(500)
						.send({
							message:'Error en la petición'
						});
		if(user){
			bcrypt.compare(password, user.password, (err, check) => {
			if(check){
				//devolver datos del usuario
				if(params.getToken){
					return res.status(200)
								.send({
									token: jwt.createToken(user)
								});

				}else{
					user.password = undefined;
					res.status(200)
					.send({
						user
					});
				}
			}else{

				return res.status(404)
							.send({
								message:'el usuario no ha podido identificarse'
							});
				}

			});
		}else{
			res.status(404)
				.send({
					message:'El usuario no ha sido encontrado'
				});
		}
	
	});
}

function getUser(req, res){
	var userId = req.params.id;
	//por url params , POST o PUT body

	User.findById(userId, (err, user) => {
		if(err)
			return res.status(500)
						.send({
							message:'Error en la petición'
						});
		if(!user)
			return res.status(404)
						.send({
							message:'usuario no encontrado'
						});
		return res.status(200)
					.send({user});
	});
}

//devolver un listado paginado de usuarios
function listUsers(req, res){
	var identity_user_id = req.user.sub;

	var page = 1;
	if(req.params.page){
		page=req.params.page;
	}

	var itemsPerPage = 5;

	User.find()
		.sort('_id')
		.paginate(page, itemsPerPage, 
			(err, users, total) =>{
				if (err)
					return res.status(500)
								.send({
									message:'error en la petición'
								});

				if(!users)
					return res.status(404)
								.send({
									message:'no se han encontrado usuarios'
								});

				return res.status(200)
							.send({
								users,
								total,
								pages: Math.ceil(total/itemsPerPage)
							});
	});

}

//editar datos de un usuario
function updateUser(req, res){
	var userId = req.params.id;
	var userUpdated = req.body;
	//borrar propiedad password
	delete userUpdated.password;
	if(userId != req.user.sub){
		return res.status(500)
					.send({
						message:'no tienes permiso para actualizar los datos del usuario'
					});
	}
	
	User.findByIdAndUpdate(userId, userUpdated, {new:true}, (err, userUp) => {
		if(err)
			return res.status(500)
						.send({
							message:'error en la petición'
						});
		if(!userUp)
			return res.status(404)
						.send({
							message:'no se ha podido actualizar el usuario'
						});
		return res.status(201)
					.send({user:userUp});
	});

}

module.exports = { home, save, login, getUser, listUsers, updateUser }