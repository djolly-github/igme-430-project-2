const mongoose = require('mongoose');
const _ = require('underscore');

mongoose.Promise = global.Promise;

let TaskModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setTitle = (str) => _.escape(str).trim();

/**
 * Mongoose Schema for user tasks
 */
const TaskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  content: {
    type: String,
  },
  value: {
    type: Number,
    min: 0,
    default: 0,
  },
  deadline: {
    type: String,
  },
});

/**
 * Converts object to API
 * @param {*} doc The doc to convert
 * @returns The converted doc
 */
TaskSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  title: doc.title,
  content: doc.content,
  value: doc.value,
  deadline: doc.deadline,
  _id: doc._id,
});

/**
 * Finds a task by its owner
 * @param {*} ownerId The id of the owner
 * @param {*} callback The callback to execute
 * @returns result
 */
// eslint will error for immediately returning for arrow-body-style,
// then will error if arrow-body-style is fixed because of max line length,
// then will error if max line length is fixed for disallowing line breaks after arrow body,
// so just disable this error instead
// eslint-disable-next-line arrow-body-style
TaskSchema.statics.findByOwner = (ownerId, callback) => {
  return TaskModel
    .find({ owner: convertId(ownerId) })
    .select('title content value deadline _id')
    .lean()
    .exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
