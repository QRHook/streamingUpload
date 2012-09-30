"use strict";

var BinaryServer = require('binaryjs').BinaryServer,
	filed = require('filed'),
	Pool = require('poolee'),
	bs,
	binarySocket = exports;


binarySocket.start = function (server, callback) {

	bs = BinaryServer({server: server});

	bs.on('connection', function (client) {

		client.on('stream', function (stream, meta) {

			var file = filed(__dirname + '/public/uploads/' + meta.name);

			stream.pipe(file);



			stream.on('data', function (data) {

				stream.write({rx: data.length / meta.size});

			});

			stream.on('end', function () {



			});
		});



	});


};

