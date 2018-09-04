'use strict'

var moment = require('moment');
var pagination = require('mongoose-pagination');

var Message = require('../models/message');
var User = require('../models/user');
var Follow = require('../models/follow');

function probandoMsg(req, res){
	return res.status(200)
				.send({
					message:'probando el controlador de mensajeria privada'
				});
}

function saveMessage(req, res){
	var params = req.body;

	if(!params.text || !params.receiver)
		return res.status(200)
					.send({
						message:'envía los datos necesarios para el mensaje'
					});

	var message = new Message();
	message.emitter=req.user.sub;
	message.receiver=params.receiver;
	message.text=params.text;
	message.createdAt=moment().unix();
	message.viewed='false';

	message.save((err, msgStored) => {
		if (err)
			return res.status(500).send({message:'error en la petición'});

		if (!msgStored)
			return res.status(404).send({message:'no se ha podido enviar el mensaje'});

		return res.status(200).send({message: msgStored});
	});	
}
	
function getMessagesReceived(req, res){
	var userId = req.user.sub;

	var page = 1;
	if (req.params.page)
		page=req.params.page;

	var itemsPerPage=5;


	Message.find({receiver: userId})
	.populate('emitter', 'name surname nick image _id')
	.paginate(page, itemsPerPage, (err, messages, total) => {
		if (err)
			return res.status(500).send({message:'error en la petición'});

		if (!messages)
			return res.status(404).send({message:'no se han podido encontrar mensajes'});

		return res.status(200).send({
			pages: Math.ceil(total/itemsPerPage),
			total: total,
			messages
		});
	});
}

function getSentMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if (req.params.page)
		page=req.params.page;

	var itemsPerPage=5;


	Message.find({emitter: userId})
	.populate('emitter receiver', 'name surname nick image _id')
	.paginate(page, itemsPerPage, (err, messages, total) => {
		if (err)
			return res.status(500).send({message:'error en la petición'});

		if (!messages)
			return res.status(404).send({message:'no se han podido encontrar mensajes'});

		return res.status(200).send({
			pages: Math.ceil(total/itemsPerPage),
			total: total,
			messages
		});
	});
}

//de aqui en adelante no testeadas

function getUnviewedMessagesCount(req, res){
	var userId=req.user.sub;

	Message.count({receiver:userId, viewed:'false'})
			.exec((err, count) => {
				if (err)
			return res.status(500).send({message:'error en la petición'});

			if (!count)
				return res.status(404).send({message:'no se han podido encontrar mensajes'});

			return res.status(200).send({
				unviewed: count
				});
			});
}

function getUnviewedMessages(req, res){
	var userId=req.user.sub;
	var page=1;

	if(req.params.page)
		page=req.params.page;

	var itemsPerPage=5;

	Message.find({receiver: userId, viewed:'false'})
	.populate('emmitter' , 'name surname nick image _id')
	.paginate(page, itemsPerPage, (err, unviewedMessages, total) => {
		if (err)
			return res.status(500).send({message:'error en la petición'});

		if (!messages)
			return res.status(404).send({message:'no se han podido encontrar mensajes'});

		return res.status(200).send({
			pages: Math.ceil(total/itemsPerPage),
			total: total,
			unviewedMessages
		});
	});
}

function setViewedMessages(req, res){
	var userId=req.user.sub;

	Message.update({receiver:userId, viewed:'false'}, {viewed:true}, {'multi':true}, (err, messagesUpd) => {
		if (err)
			return res.status(500).send({message:'error en la petición'});

		if (!messages)
			return res.status(404).send({message:'no se han podido actualizar mensajes'});

		return res.status(200).send(messagesUpd);

	});
}

module.exports = { probandoMsg, saveMessage, getMessagesReceived, getSentMessages, getUnviewedMessagesCount, getUnviewedMessages, setViewedMessages }