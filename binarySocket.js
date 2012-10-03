"use strict";

var BinaryServer = require('binaryjs').BinaryServer,
	filed = require('filed'),
	Pool = require('poolee'),
	rackspace = require('./lib/rackspace'),
	logger = require('./lib/logger'),
	bs,
	binarySocket = exports;

binarySocket.start = function (server, callback) {

	//var pool = new Pool(require('http'), ["127.0.0.1:8098"]);

	bs = BinaryServer({server: server});

	bs.on('connection', function (client) {

		client.on('stream', function (stream, meta) {

			// var file = filed(__dirname + '/public/uploads/' + meta.name);

			// stream.pipe(file);

			console.log(meta);

			rackspace.addFile(meta.type, meta.name, stream, function (err, res) {

				var thing;

			});

			stream.on('data', function (data) {

				stream.write({
					rx: data.length / meta.size,
					uniqueID: meta.uniqueID
				});

			});

		});



	});

	callback();

};

