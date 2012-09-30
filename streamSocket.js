"use strict";

var shoe = require('shoe'),
	emitStream = require('emit-stream'),
	JSONStream = require('JSONStream'),
	EventEmitter2 = require('eventemitter2').EventEmitter2,
	socket = exports,
	sock;

socket.start = function start(server, callback) {

	sock = shoe(function(stream) {
    var ev = new EventEmitter2({
      wildcard: true, // should the event emitter use wildcards.
      delimiter: '::', // the delimiter used to segment namespaces, defaults to `.`.
      maxListeners: 20 // the max number of listeners that can be assigned to an event, defaults to 10.
    });

    emitStream(ev)
			.pipe(JSONStream.stringify())
			.pipe(stream)
    ;

    var intervals = [];

		intervals.push(setInterval(function () {
			ev.emit('upper', 'abc');
		}, 500));

		intervals.push(setInterval(function () {
			ev.emit('lower', 'def');
		}, 300));

		stream.on('end', function () {

			intervals.forEach(clearInterval);

		});


	});

	sock.install(server, '/sock');

	callback();

};

