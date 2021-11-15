const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AppModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;

const AppSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
});

AppSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return AppModel.find(search).select('').lean().exec(callback);
};

AppModel = mongoose.model('App', AppSchema);

module.exports.AppModel = AppModel;
module.exports.AppSchema = AppSchema;
