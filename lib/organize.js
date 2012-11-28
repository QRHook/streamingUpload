"use strict";

var types = ['ogg', 'mpeg', 'mp4', 'webm'],
	mime = require('mime'),
	rackspace = require('./rackspace'),
	db = require('./couch').db,
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

			//insertToRiak(res.getUrls);
			insertToCouch(res.getUrls);

		});

		function insertToCouch (urls) {
			formJSON(urls, function (json) {
				var insert = db.insert(json, id);
				insert.pipe(process.stdout);

				insert.on('err', function () {
					cb(err, null);
				});

				insert.on('end', function () {
					cb(null, true);
				});
			});
		}

		function insertToRiak (urls) {
			var pool = new Pool(require('http'), ["127.0.0.1:8098"]);

			formJSON(urls, function (json) {

				pool.request({
					path: '/riak/' + container + '/' + id,
					method: 'PUT',
					data: JSON.stringify(json),
					headers: {
						'Content-type': 'application/json'
					}
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

			urls.streamingUrl += '/' + newName;
			urls.sslUrl += '/' + newName;
			urls.url += '/' + newName;

			callback(urls);

		}

	});

	/*
	 * Needs to be made more solid for types
	 */
	function parseInfo (type, name, back) {

		var arr = name.split('.');

		var ext = arr[arr.length -1];

		var container = mime.extension(type);

		var id = uuid();

		var newName = id + '.' + ext;

		back(null, container, id, newName);

	}

};
