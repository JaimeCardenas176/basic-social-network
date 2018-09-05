'use strict'

var express = require('express');

var MessageController = require('../controllers/message');

var auth = require('../middlewares/auth');

var api = express.Router();

api.get('/prueba-messages', auth.ensureAuth, MessageController.probandoMsg);
api.get('/get-my-messages/:page?', auth.ensureAuth, MessageController.getMessagesReceived);
api.get('/messages/:page?', auth.ensureAuth, MessageController.getSentMessages);
api.get('unviewed-messages-count', auth.ensureAuth, MessageController.getUnviewedMessagesCount);
api.get('/unviewed-messages/:page?', auth.ensureAuth, MessageController.getUnviewedMessages);


api.post('/message', auth.ensureAuth, MessageController.saveMessage);

api.put('set-viewed-messages', auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;