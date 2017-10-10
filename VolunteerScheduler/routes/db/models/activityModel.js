var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var activitySchema = Schema({
    id: String,
    programId: String,
    
    title: String,
    description: String,

    shifts: [{ startTime: Date, endTime: Date, minPositions: Number, maxPositions: Number }],
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

userSchema.set('toJSON', {
    transform: function (doc, result, options) {
        result.id = result._id;
        // remove mongo internal fields
        delete result._id;
        delete resule._v;
    }
});

var Activity = mongoose.Model("Activity", activitySchema);

module.exports = Activity;