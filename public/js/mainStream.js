//var shoe = require('shoe');
var reconnect = require('reconnect');
var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');

var parser = JSONStream.parse([true]);
//var stream = parser.pipe(shoe('/sock')).pipe(parser);
//var ev = emitStream(stream);

reconnect(function (stream) {

	var s = parser.pipe(stream).pipe(parser);

	var ev = emitStream(s);

	ev.on('lower', function (msg) {
    var div = document.createElement('div');
    div.textContent = msg.toLowerCase();
    document.body.appendChild(div);
	});

	ev.on('upper', function (msg) {
    var div = document.createElement('div');
    div.textContent = msg.toUpperCase();
    document.body.appendChild(div);
	});


}).connect('/sock');



