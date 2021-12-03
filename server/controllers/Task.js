const models = require('../models');
const { ROUTES } = require('../routes');

const { Task } = models;

/**
 * Handles retrieval of tasks
 * @param {*} request request object
 * @param {*} response response object
 * @returns response.status().json() depending on request parameters
 */
const getTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(200).json({ tasks: docs });
  });
};

/**
 * Handles task creation request
 * @param {*} request request object
 * @param {*} response response object
 * @returns response.status().json() depending on request parameters
 */
const createTask = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (req.body._id) {
    const updated = {
      title: req.body.title,
      content: req.body.content,
      value: req.body.value,
      deadline: req.body.deadline,
    };

    return Task.TaskModel.updateOne({ _id: req.body._id }, updated, (err) => {
      if (err) {
        return res.status(500).json({ error: 'An error occurred' });
      }

      return res.status(200).json({ message: 'Task updated' });
    });
  }

  const taskData = {
    title: req.body.title,
    content: req.body.content,
    value: req.body.value,
    owner: req.session.account._id,
    deadline: req.body.deadline,
  };
  const newTask = new Task.TaskModel(taskData);

  const taskPromise = newTask.save();
  taskPromise.then(() => res.status(201).json({ redirect: ROUTES.home }));
  taskPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  });

  return taskPromise;
};

/**
 * Handles task deletion request
 * @param {*} request request object
 * @param {*} response response object
 * @returns response.status().json() depending on request parameters
 */
const deleteTask = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.deleteOne({ _id: req.body._id }, (err) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(200).json({ redirect: ROUTES.home });
  });
};

module.exports.getTasks = getTasks;
module.exports.createTask = createTask;
module.exports.deleteTask = deleteTask;
