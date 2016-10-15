'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Task = mongoose.model('Task'),
	_ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
	var task = new Task(req.body);
	task.user = req.user;

	task.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
	res.jsonp(req.task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
	var task = req.task ;

	task = _.extend(task , req.body);

	task.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
	var task = req.task ;

	task.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * List of Tasks
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


	Task
		.find()
		.filter(filter)
		.order(sort)
		.populate('assignee', 'displayName')
		.populate('watcher', 'displayName')
		.populate('project', 'name')
		.populate('category', 'name')
		.page(pagination, function(err, tasks){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(tasks);
			}
		});

};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
	Task.findById(id).populate('user', 'displayName').exec(function(err, task) {
		if (err) return next(err);
		if (! task) return next(new Error('Failed to load Task ' + id));
		req.task = task ;
		next();
	});
};

/**
 * Task authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.task.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
