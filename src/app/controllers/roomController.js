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
        const createdRoom = new Room({ ...req.body, url: roomURL });
        try {
            await createdRoom.save();
            res.status(200).json(createdRoom);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    // //[POST]
    // async join(req, res, next) {
    //     const userId = req.body.userId;
    //     const roomId = req.params.id;
    //     console.log('room id : ',req.body)
    //     if (!userId) {
    //         console.log("UserID is not sent with the request!")
    //     }

    //     const roomData = await Room.findOne({ url: roomId });
    //     if (!roomData) res.status(404).error('room not found!');

    //     const isJoint = roomData.users.findIndex(user => user._id === userId);
    //     if (isJoint !== -1) {
    //         res.status(200).json(roomData);
    //         return;
    //     }
    //     const updatedRoom = await Room.findOneAndUpdate({ url: roomId }, { $push: { users: userId } });
    //     res.status(200).json(updatedRoom);
    // }

    // //[DELETE]
    // async leave(req, res, next) {

    // }
}

module.exports = new RoomController;