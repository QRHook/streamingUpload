"use strict";

var types = ['ogg', 'mpeg', 'mp4', 'webm'],
	mime = require('mime'),
	rackspace = require('./rackspace'),
	pauseStream = require('pause-stream');

var organize = module.exports = exports = function (type, name, stream, callback) {

	var ps = new pauseStream();
	stream.pipe(ps.pause());

	var container = mime.extension(type);

	if(types.indexOf(container) !== -1) {

		var array = type.split('/');

		var newName = array[0] + '/' + name;

		rackspace.addFile(container, newName, ps, callback);

	} else {

		rackspace.addFile(container, name, ps, callback);

	}

};
