'use strict'

//var path = require('path');
//var fs = require('fs');

var pagination = require('mongoose-pagination');

//modelos
var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res){
	return res.status(200)
				.send({
					message:'controlador de follows funcionando!'
			});	
}

function saveFollow(req, res){
	var params = req.body;

	var follow = new Follow();
	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((err, followStored) => {
		if(err)
			return res.status(500)
						.send({
							message:'error al guardar el seguimiento'
						});
		if(!followStored)
			return res.status(404)
						.send({
							message:'no se ha guardado el seguimiento'
						});

		return res.status(200)
					.send({
						follow:followStored
					});
	});
}

function deleteFollow(req, res){
	var userId = req.user.sub;
	var followedId = req.params.id;

	Follow.find({ 'user': userId, 'followed':followedId})
			.remove((err) => {
				if(err)
					return res.status(500)
								.send({
									message:'error al eliminar el follow'
								});
				
				return res.status(200)
							.send({
								message:'follow eliminado satisfacotriamente'
							});
			});
}

function listFollowingUsers(req, res){
	var userId = req.user.sub;

	if(req.params.id && req.params.page){
		userId=req.params.id;
	}

	var page = 1;
	
	if(req.params.page){
		page=req.params.page;
	}else{
		page=req.params.id;
	}

	var itemsPerPage = 4;

	Follow.find({user:userId})
			.populate({path: 'followed'})
			.paginate(page, itemsPerPage, (err, follows, total) => {
				if(err)
					return res.status(500)
								.send({
									message:'error en el servidor'
								});
				
				if(!follows)
					return res.status(404)
								.send({
									message:'no estas siguiendo a ningun usuario'
								});
				
				return res.status(200)
							.send({
								total: total,
								pages: Math.ceil(total/itemsPerPage),
								follows
							});
			});

}

function listFollowedUsers(req, res){
	var userId = req.user.sub;

	if(req.params.id && req.params.page){
		userId=req.params.id;
	}

	var page = 1;
	
	if(req.params.page){
		page=req.params.page;
	}else{
		page=req.params.id;
	}

	var itemsPerPage = 4;

	Follow.find({followed:userId})
			.populate({path: 'followed'})
			.paginate(page, itemsPerPage, (err, follows, total) => {
				if(err)
					return res.status(500)
								.send({
									message:'error en el servidor'
								});
				
				if(!follows)
					return res.status(404)
								.send({
									message:'no estas siguiendo a ningun usuario'
								});
				
				return res.status(200)
							.send({
								total: total,
								pages: Math.ceil(total/itemsPerPage),
								follows
							});
			});


}

module.exports = { prueba, saveFollow, deleteFollow, listFollowingUsers, listFollowedUsers }