var Program = require("./models/programModel");

function save(program, callback) {
    Program(program).save(callback);
}
module.exports.save = save;

function findById(programId, callback) {
    Program.findById(programId, callback);
}
module.exports.findById = findById;

function findAll(callback) {
    Program.find({}, callback);
}
module.exports.findAll = findAll;

function update(programId, newProgram, callback) {
    User.findOneAndUpdate({ _id: programId }, newProgram, callback);
}
module.exports.update = update;

function remove(programId, callback) {
    User.findOneAndRemove({ _id: programId }, callback);
}
module.exports.remove = remove;