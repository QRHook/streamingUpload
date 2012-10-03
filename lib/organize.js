"use strict";

var types = ['ogg', 'mpeg', 'mp4', 'webm'],
	mime = require('mime'),
	rackspace = require('./rackspace'),
	utile = require('utile'),
	uuid = require('node-uuid'),
	Pool = require('poolee'),
	async = utile.async,
	pauseStream = require('pause-stream');

var organize = module.exports = exports = function (type, name, stream, cb) {

	var ps = new pauseStream();
	stream.pipe(ps.pause());

	parseInfo(type, name, function (err, container, id, newName) {

		async.parallel({

			addFile: function (callback) {

				rackspace.addFile(container, newName, ps, callback);

			},

			getUrls: function (callback) {

				rackspace.getContainerUrls(container, callback);

			}

		}, function (err, res) {

			if(err) {

				cb(err, null);

			}

			insertToRiak(res.getUrls);

		});

		function insertToRiak (urls) {

			var pool = new Pool(require('http'), ["127.0.0.1:8098"]);

			formJSON(urls, function (json) {

				pool.request({
					path: '/riak/' + container + '/' + id,
					method: 'PUT',
					data: JSON.stringify(json),
					headers: {'Content-type': 'application/json'}
				}, function(err, res, body) {

					if(!err && res) {

						console.log(res.headers);

						cb(null, res);

					} else {

						console.log(err);

						cb(err, null);

					}

				});

			});

		}

		function formJSON (urls, callback) {

			urls.type = type;

			urls.name = name;

			callback(urls);

		}

	});

	/*
	 * Needs to be made more solid for types
	 */
	function parseInfo (type, name, back) {

		var container = mime.extension(type);

		var id = uuid();

		var newName = id + '.' + container;

		back(null, container, id, newName);

	}

};
