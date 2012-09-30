"use strict";

var filed = require('filed'),
	fs = require('fs'),
	path = require('path'),
	db = require('../lib/riak').db,
	Pool = require('poolee');


exports.init = function (callback) {

	var pool = new Pool(require('http'), ["127.0.0.1:8098"]);

	var file = filed(path.resolve(__dirname, '../public/img/qrhooklogo-alonev4.png'));

	file.on('error', function (exception) {

		console.log(exception);

	});

	file.on('end', function () {

	});

	var options = {

		http_headers: {'Content-type': 'image/png'},
		stream: true

	};

	pool.request({
		path: '/riak/pictures/qrhook3.png',
		method: 'PUT',
		data: file,
		headers: {'Content-type': 'image/png'},
		stream: true
	}, function(err, res, body) {

		if(!err && res) {

			callback(null, res);

		} else {

			callback(err, null);

		}

	});

};


if(require.main === module) {

	exports.init(function (err, res) {

		if(!err) {

			console.log(res);

			process.exit(0);

		} else {

			console.log(err);

			process.exit(1);

		}

	});

}
