const Room = require('../models/Room');
const { v4: uuidV4 } = require('uuid');

class RoomController {
    //[GET] 
    index(req, res, next) {
        Room.find({})
            .then(rooms => {
                res.status(200).json(rooms);
            })
            .catch(next)
    }

    //[POST]
    async create(req, res, next) {
        const roomURL = uuidV4();
        const createdRoom = new Room({...req.body, url: roomURL});
        try {
            await createdRoom.save();
            res.status(200).json(createdRoom);
        } catch (error) {
            res.status(400).json(error);
        }
    }
}

module.exports = new RoomController;