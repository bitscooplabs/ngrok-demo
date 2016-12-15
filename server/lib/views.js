'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const httpErrors = require('http-errors');


let router = new express.Router();
let instance = router.route('/:type/:id/?$');
let collection = router.route('/:type/?$');


collection.get(function(req, res, next) {
	new Promise(function(resolve, reject) {
		let stream = fs.createReadStream(path.join('fixtures', req.params.type) + '.json');

		stream.on('error', function(err) {
			reject(err);
		});

		stream.on('readable', function() {
			resolve(stream);
		});
	})
		.catch(function(err) {
			next(httpErrors(404));
		})
		.then(function(stream) {
			res.setHeader('Content-Type', 'application/json');

			stream.pipe(res);
		});
});


instance.get(function(req, res, next) {
	new Promise(function(resolve, reject) {
		let data;

		try {
			data = require(path.join(process.cwd(), 'fixtures', req.params.type) + '.json');
		} catch(err) {
			env.logger.debug(err);

			return reject(httpErrors(404));
		}

		for (let i = 0; i < data.length; i++) {
			if (String(data[i].id) === req.params.id) {
				return resolve(data[i]);
			}
		}

		reject(httpErrors(404));
	})
		.catch(function(err) {
			next(httpErrors(404));
		})
		.then(function(item) {
			res.json(item);
		});
});


module.exports = router;
