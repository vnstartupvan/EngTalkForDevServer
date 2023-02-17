const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    id: ObjectId,
    username: { type: String, default: 'Any' },
    password: { type: String, default: 'Any' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);