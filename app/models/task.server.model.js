'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Task name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Task description',
		trim: true
	},
	assignee: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	watcher: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	project: {
		type: Schema.ObjectId,
		ref: 'Project'
	},
	category: {
		type: Schema.ObjectId,
		ref: 'Category'
	},
	dueDate: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Task', TaskSchema);
