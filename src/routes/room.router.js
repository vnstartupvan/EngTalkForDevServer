const express = require('express');
const route = express.Router();
const RoomController = require('../app/controllers/roomController');
const { isAuth } = require('../app/middlewares/auth.middlewares');

route.get('/room/all', RoomController.index);
route.post('/room/create', RoomController.create);
// route.post('/room/:id', RoomController.join);
// route.delete('/room/leave/:id', isAuth, RoomController.leave);



module.exports = route;