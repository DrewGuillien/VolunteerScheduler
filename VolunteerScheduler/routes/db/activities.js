﻿var Activity = require("./models/activityModel");
var ObjectId = require("mongoose").Types.ObjectId;

function save(activity, callback) {
    Activity(activity).save(callback);
}
module.exports.save = save;

function findById(programId, activityId, callback) {
    Activity.findOne({ programId: programId, _id: activityId }, callback);
}
module.exports.findById = findById;

function findByProgramId(programId, callback) {
    Activity.find({ programId: new ObjectId(programId) }, callback);
}
module.exports.findByProgramId = findByProgramId;

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