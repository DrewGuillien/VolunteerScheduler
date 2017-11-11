var bcrypt = require("bcrypt");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    role: [String],
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, //encrypted by bcrypt
        required: true
    },
    name: { first: String, last: String },
    email: String,

    enabled: Boolean
});

userSchema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password") || user.isNew) {
        bcrypt.genSalt(10, function (error, salt) {
            if (error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, function (error, hash) {
                if (error) {
                    return next(error);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
        if (error) {
            return callback(error);
        }
        callback(null, isMatch);
    });
};

userSchema.set('toJSON',  {
    transform: function (doc, result, options) {
        result.id = result._id;
        // remove mongo internal fields
        delete result._id;
        delete result._v;
    }
});

var User = mongoose.model("User", userSchema);

module.exports = User;