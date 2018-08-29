'use strict'

var mongo = require('mongoose');

var Schema = mongo.Schema;

var userSchema = Schema({
	name: String,
	surname: String,
	email: String, 
	password: String,
	nickname: String,
	role: String,
	image: String,
});

module.exports = mongo.model('User', userSchema);