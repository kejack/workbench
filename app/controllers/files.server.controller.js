'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	File = mongoose.model('File'),
	_ = require('lodash');

/**
 * Create a File
 */
exports.create = function(req, res) {
	var file = new File(req.body);
	file.user = req.user;

	file.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(file);
		}
	});
};

/**
 * Show the current File
 */
exports.read = function(req, res) {
	res.jsonp(req.file);
};

/**
 * Update a File
 */
exports.update = function(req, res) {
	var file = req.file ;

	file = _.extend(file , req.body);

	file.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(file);
		}
	});
};

/**
 * Delete an File
 */
exports.delete = function(req, res) {
	var file = req.file ;

	file.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(file);
		}
	});
};

/**
 * List of Files
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};


	File
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, files){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(files);
			}
		});

};

/**
 * File middleware
 */
exports.fileByID = function(req, res, next, id) {
	File.findById(id).populate('user', 'displayName').exec(function(err, file) {
		if (err) return next(err);
		if (! file) return next(new Error('Failed to load File ' + id));
		req.file = file ;
		next();
	});
};

/**
 * File authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.file.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
