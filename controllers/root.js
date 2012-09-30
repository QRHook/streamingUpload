"use strict";

var filed = require('filed'),
	oppressor = require('oppressor'),
	logger = require('../lib/logger'),
	platform = require('platform'),
	db = require('../lib/riak').db,
	errs = require('errs'),
	cycle = require('cycle'),
	utile = require('utile'),
	async = utile.async,
	root = exports;

root.index = function index () {

	var browser = platform.parse(this.req.headers['user-agent']),
		readstream;

	if(browser.name === 'IE') {

		readstream = filed(__dirname + '/../views/ie.html');

	} else {

		readstream = filed(__dirname + '/../views/index.html');

	}

	readstream.pipe(oppressor(this.req))
		.pipe(this.res);

};
