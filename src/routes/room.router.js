const express = require('express');
const route = express.Router();
const RoomController = require('../app/controllers/roomController');

route.get('/room/all', RoomController.index);
route.post('/room/create', RoomController.create);


module.exports = route;