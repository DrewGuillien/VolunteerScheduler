var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var programSchema = Schema({
    id: String,
    title: String,
    description: String,
});

programSchema.set("toJSON", {
    transform: function (doc, result, options) {
        result.id = result._id;
        // remove mongo internal fields
        delete result._id;
        delete result._v;
    }
});

var Program = mongoose.model("Program", programSchema);

module.exports = Program;