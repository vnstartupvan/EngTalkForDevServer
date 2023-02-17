const UserModel = require('../models/User');
const authMethod = require('../methods/auth.method');
const dotenv = require('dotenv');
dotenv.config();

exports.isAuth = async (req, res, next) => {
    // Lấy access token từ header
    const accessTokenFromHeader = req.headers.x_authorization;
    console.log(accessTokenFromHeader);
    if (!accessTokenFromHeader) {
        return res.status(401).send('Không tìm thấy access token!');
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const verified = await authMethod.verifyToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );
    if (!verified) {
        return res
            .status(401)
            .send('Bạn không có quyền truy cập vào tính năng này!');
    }

    const user = await UserModel.findOne({ username: verified.payload.username });
    req.user = user;

    return next();
};
