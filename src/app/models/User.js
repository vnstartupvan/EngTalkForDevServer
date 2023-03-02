const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    id: ObjectId,
    username: { type: String },
    password: { type: String },
    pic: { type: String, default: '' },
    fullname: { type: String, default: 'null' },
    email: { type: String, default: 'null' },
    refreshToken: { type: String }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', User);