const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

/**
 * Utility for password validation
 * @param {*} doc The object with the password being checked
 * @param {*} password The existing password
 * @param {*} callback Handler for the result of validation
 * @returns The result of the callback
 */
const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

/**
 * Mongoose Schema for user accounts
 */
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  experience: {
    type: Number,
    default: 0,
  },
});

/**
 * Converts object to API
 * @param {*} The doc to convert
 * @returns The converted doc
 */
AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  isPremium: doc.isPremium,
  experience: doc.experience,
  _id: doc._id,
});

/**
 * Utility to find a user by name
 * @param {*} name The username to search for
 * @param {*} callback Function to call after find attempt
 * @returns Result of find function
 */
AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

/**
 * Hash generator for account schema
 * @param {*} password The password to hash
 * @param {*} callback Function to call after hash
 */
AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

/**
 * Authentication for user account
 * @param {*} username The username to auth
 * @param {*} password The password to auth
 * @param {*} callback Function to call on result of auth
 * @returns Result of callback
 */
AccountSchema.statics.authenticate = (username, password, callback) => {
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

/**
 * Updates user account password
 * @param {*} username The username of the account to update
 * @param {*} password The password to update the account with
 * @param {*} callback Function to call on result of update
 * @returns Result of callback
 */
// eslint will error for immediately returning for arrow-body-style,
// then will error if arrow-body-style is fixed because of max line length,
// then will error if max line length is fixed for disallowing line breaks after arrow body,
// so just disable this error instead
// eslint-disable-next-line arrow-body-style
AccountSchema.statics.updatePassword = (username, password, callback) => {
  return AccountModel.generateHash(password, (salt, pass) => {
    AccountModel.updateOne({ username }, { password: pass, salt }, (err) => {
      if (err) {
        return callback(err);
      }

      return callback();
    });
  });
};

/**
 * Toggles premium on a user account
 * @param {*} username The username of the account to update
 * @param {*} callback Function to call on result of toggle
 */
// eslint will error for immediately returning for arrow-body-style,
// then will error if arrow-body-style is fixed because of max line length,
// then will error if max line length is fixed for disallowing line breaks after arrow body,
// so just disable this error instead
// eslint-disable-next-line arrow-body-style
AccountSchema.statics.togglePremium = (username, callback) => {
  return AccountModel.findByUsername(username, (err, doc) => {
    if (err || !doc) {
      return callback(err);
    }

    return AccountModel.updateOne({ username }, { isPremium: !doc.isPremium }, (errUpd) => {
      if (errUpd) {
        return callback(errUpd);
      }

      return callback();
    });
  });
};

/**
 * Updates user's experience
 * @param {*} username The username of the account to update
 * @param {*} experience The new value of the user's experience
 * @param {*} callback Function to call on result of toggle
 */
// eslint will error for immediately returning for arrow-body-style,
// then will error if arrow-body-style is fixed because of max line length,
// then will error if max line length is fixed for disallowing line breaks after arrow body,
// so just disable this error instead
// eslint-disable-next-line arrow-body-style
AccountSchema.statics.updateExperience = (username, experience, callback) => {
  return AccountModel.findByUsername(username, (err, doc) => {
    if (err || !doc) {
      return callback(err);
    }

    return AccountModel.updateOne({ username }, { experience }, (errUpd) => {
      if (errUpd) {
        return callback(errUpd);
      }

      return callback();
    });
  });
};

/**
 * Model for user account schema
 */
AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
