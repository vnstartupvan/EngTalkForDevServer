const express = require('express');
const roomRoute = require('./room.router');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const router = express.Router();

function route(app) {
    app.use(roomRoute)
    app.use(authRoute)
    app.use(userRoute)
}

module.exports = route;
