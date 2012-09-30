var RiakClient = require('riak'),
	config = require('../config/').riak,
	riak = exports;

var client = new RiakClient(config.servers, config.clientId, config.poolName);

riak.db = client;
