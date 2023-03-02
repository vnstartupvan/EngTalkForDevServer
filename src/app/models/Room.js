const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Room = new Schema({
    id: ObjectId,
    url: { type: String, require: true },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    userLimit: { type: Number, default: 10 },
    topic: { type: String, default: 'Any' },
    language: { type: String, default: 'Any' },
    level: { type: String, default: 'Any' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Room', Room);