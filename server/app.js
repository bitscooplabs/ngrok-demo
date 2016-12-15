'use strict';

const Promise = require('bluebird');
const URL = require('url-parse');
const bristolConf = require('bristol-config');
const config = require('config');
const express = require('express');


let app = express();
let logger = bristolConf(config.logging);

// Disable insecure header information.
app.disable('x-powered-by');

// Mount middleware.
app.use([
	// IP tracking
	require('./lib/middleware/ip'),

	// Add tracking/diagnostic metadata to the request.
	require('./lib/middleware/meta'),

	// Body parsing for JSON (convert stream to completed buffer).
	require('body-parser').json({
		limit: 2500000 // bytes (2.5MB)
	}),

	// Enable request logging.
	require('./lib/middleware/logging')(logger),

	// Mount main views.
	require('./lib/views'),

	// Send a 404 if the route is not otherwise handled.
	require('./lib/middleware/handle-404'),

	// Send an error code corresponding to a handled application error.
	require('./lib/middleware/handle-error')
]);


// SHUTDOWN
(function(process) {
	function shutdown(code) {
		process.exit(code || 0);
	}

	process.once('SIGINT', function() {
		logger.info('Gracefully shutting down from SIGINT (CTRL+C)');
		shutdown(0);
	});

	process.once('SIGTERM', function() {
		shutdown(0);
	});
})(process);


// BOOT
Promise.all([])
	.spread(function() {
		global.env = {
			logger: logger
		};
	})
	.then(function() {
		return Promise.all([
			new Promise(function(resolve, reject) {
				let url = new URL(config.address);
				let hostname = (url.hostname === '0.0.0.0' || url.hostname === '') ? '*' : url.hostname;
				let port = parseInt(url.port);

				let server = (hostname === '*') ? app.listen(port) : app.listen(port, hostname);

				server.once('listening', function() {
					resolve(server);
				});

				server.once('error', reject);
			})
		]);
	})
	.spread(function(http) {
		logger.info('HTTP server listening.', http.address());
	})
	.catch(function(err) {
		logger.error(err);
		process.exit(1);
	});


process.stdin.resume();
