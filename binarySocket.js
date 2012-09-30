"use strict";

var BinaryServer = require('binaryjs').BinaryServer,
	filed = require('filed'),
	Pool = require('poolee'),
	bs,
	binarySocket = exports;


binarySocket.start = function (server, callback) {

	var pool = new Pool(require('http'), ["127.0.0.1:8098"]);

	bs = BinaryServer({server: server});

	bs.on('connection', function (client) {

		client.on('stream', function (stream, meta) {

			// var file = filed(__dirname + '/public/uploads/' + meta.name);

			// stream.pipe(file);

			pool.request({
				path: '/riak/pictures/' + meta.name,
				method: 'PUT',
				data: stream,
				headers: {'Content-type': 'image/png'},
				stream: true
			}, function(err, res, body) {

				if(!err && res) {

					callback(null, res);

				} else {

					callback(err, null);

				}

			});

			stream.on('data', function (data) {

				stream.write({rx: data.length / meta.size});

			});

		});



	});

	callback();

};

