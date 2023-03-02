const UserModel = require('../models/User');


class UserController {
    async getProfile(req, res) {
        // const user = await UserModel.findOne({ username: username });
        return res.status(200).json(req.user)
    }

    // async getUsers(req, res) {
    //     console.log(req.data)
    //     const usersID = req.data.usersId;
    //     console.log(usersID)
    //     const users = mongoose.find({ _id: { $in: usersID } })
    //     res.status(200).json(users)
    // }
}

module.exports = new UserController;