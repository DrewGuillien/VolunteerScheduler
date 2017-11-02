var Activity = require("./models/activityModel");

function save(activity, callback) {
    Activity(activity).save(callback);
}
module.exports.save = save;

function findById(activityId, callback) {
    Activity.findById(activityId, callback);
}
module.exports.findById = findById;

function findAll(callback) {
    Activity.find({}, callback);
}
module.exports.findAll = findAll;

function update(activityId, newactivity, callback) {
    Activity.findOneAndUpdate({ _id: activityId }, newactivity, callback);
}
module.exports.update = update;

function remove(activityId, callback) {
    Activity.findOneAndRemove({ _id: activityId }, callback);
}
module.exports.remove = remove;