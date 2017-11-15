var User = require("./models/userModel.js");
//var bcrypt = require("bcrypt-nodejs");

function save(user, callback) {
    new User(user).save(callback);
}
module.exports.save = save;

function findById(userId, callback) {
    User.findById(userId, callback);
}
module.exports.findById = findById;

function findByUsername(username, callback) {
    User.findOne({ username: username }, callback);
}
module.exports.findByUsername = findByUsername;

function findAll(callback) {
    User.find({}, callback);
}
module.exports.findAll = findAll;

function update(uid, newUser, callback) {
    User.findOneAndUpdate({ _id: uid }, newUser, callback);
}
module.exports.update = update;

function remove(uid, callback) {
    User.remove({ _id: uid }, callback);
}
module.exports.remove = remove;
