var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var activitySchema = Schema({
    id: String,
    programId: { type: Schema.Types.ObjectId, ref: "Program"},
    
    title: String,
    description: String,

    shifts: [{
        date: Date,
        startTime: String,
        endTime: String,
        minPositions: Number,
        maxPositions: Number,
        volunteers: [{ type: Schema.Types.ObjectId, ref: "User" }]
    }]
});

activitySchema.set('toJSON', {
    transform: function (doc, result, options) {
        result.id = result._id;
        // remove mongo internal fields
        delete result._id;
        delete result._v;
    }
});

var Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;