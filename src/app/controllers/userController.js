

class UserController {
    async getProfile (req, res) {
        return res.status(200).json({profile: 'profile'})
    }
}

module.exports = new UserController;