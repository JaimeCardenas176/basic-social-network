'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var pagination = require('mongoose-pagination');
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res){
	return res.status(200)
				.send({
					message: 'probando publicaciones'
				});
}

function savePublication(req, res){
	var params = req.body;
	if(!params.text)
		return res.status(400)
					.send({
						message:'La publicación debe contener un texto'
					});

	var publication = new Publication();
	publication.text = params.text;
	publication.file = null;
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

	publication.save((err,publicationStored) => {
		if(err)
			return res.status(500)
						.send({
							message:'Error al guardar la publicación'
						});

		if(!publicationStored)
			return res.status(500)
						.send({
							message:'La publicación no ha sido guardada'
						});

		return res.status(200).send({publication: publicationStored})
	});
}

//listar las publicaciones de todos los usuarios que sigo
//(TIMELINE)
function getPublications(req, res){
	var page = 1;
	if(req.params.page)
		page=req.params.page;

	var itemsPerPage = 5;

	Follow.find({'user': req.user.sub})
			.populate('followed')
			.exec((err,follows) => {
				if(err)
					return res.status(500)
								.send({
									message:'error al devolver el seguimiento'
								});

				var follows_clean = [];

				follows.forEach((follow) => {
					follows_clean.push(follow.followed);
				});

				Publication.find({'user': {'$in': follows_clean}})
							.sort('-created_at').populate('user')
							.paginate(page, itemsPerPage, (err,publications, total) => {
								if(err)
									return res.status(500)
												.send({
													message:'error al guardar la publicación'
												});

								if(!publications)
									return res.status(404)
												.send({
													message: 'no hay publicaciones nuevas'
												});

								return res.status(200).send({
									total_items: total,
									pages: Math.ceil(total/itemsPerPage),
									page: page,
									publications
								});
							});

			});
}

function getPublication(req, res){
	var publicationId= req.params.id;

	Publication.findById(publicationId, (err, publication) => {
		if(err)
			return res.status(500)
						.send({
							message: 'error al devolver la publicación'
						});

		if(!publication)
			return res.status(404)
						.send({
							message:'no se ha encontrado la publicación'
						});

		return res.status(200).send({publication});
	});
}

function deletePublication(req, res){
	var publicationId=req.params.id;

	Publication.find({'user':req.user.sub, '_id':publicationId}).remove((err, publicationRemoved) => {
		if(err)
			return res.status(500)
						.send({
							message: 'error al borrar la publicación'
						});

		if(!publicationRemoved)
			return res.status(404)
						.send({
							message:'no se ha borrado la publicación'
						});

		return res.status(200).send({publication: publicationRemoved});
	});
}

//subir imagen/avatar
function uploadImg(req, res){
	var publicationId = req.params.id;


	if(req.files){
		var file_path = req.files.image.path;
		//console.log(file_path);
		var file_split = file_path.split('\/');
		//console.log(file_split);

		var file_name = file_split[2];
		//console.log(file_name);
		var ext_split = file_name.split('\.');
		//console.log(ext_split);
		var file_ext = ext_split[1];
		//console.log(file_ext);


		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg'){
			Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publucation) => {
				if(publication){
					//actualizar el dcumento del usuario logueado
					Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUp) =>{
					if(err)
						return res.status(500)
									.send({
										message:'error en la petición'
									});

					if(!publicationUp)
						return res.status(404)
									.send({
										message:'no se ha podido actualizar la publicación'
								});

					return res.status(200).send({publication: publicationUp});

					});

				}else{
				return removeUploadedFiles(res, file_path, 'no tienes permiso para editar esta publicación');
				}
				});
		}else{
			//borrado de archivo en caso de que algo vaya mal{
			return removeUploadedFiles(res, file_path, 'extensión no válida');
		}

	}else{
		return res.status(200)
					.send({
						message:'no se han subido archivos'
					});
	}
}

function removeUploadedFiles(res, file_path, msg){

	fs.unlink(file_path, (err) =>{
					return res.status(200)
								.send({
									message:msg
								});
			});
}

function getImgFile(req, res){
	var img_file = req.params.imageFile;
	var path_file = './uploads/publications/'+img_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200)
				.send({
					message:'no existe la imagen'
				});
		}
	});
}

module.exports = { probando, savePublication, getPublications, getPublication, deletePublication, uploadImg, getImgFile }