var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = Schema({
    role: [String],
    username: String,
    password: String, //encrypted string
    name: { first: String, last: String },
    email: String,

    enabled: boolean
});

userSchema.set('toJSON',  {
    transform: function (doc, result, options) {
        result.id = result._id;
        // remove mongo internal fields
        delete result._id;
        delete resule._v;
    }
});

var User = mongoose.Model("User", userSchema);

module.exports = User;