const UserModel = require('../models/User');
const bcrypt = require("bcrypt");
const authMethod = require("../methods/auth.method");
const randToken = require('rand-token');
const utils = require('../utils/utils');
class authController {
    async register(req, res) {
        console.log(req.body);
        const username = req.body.username;
        const fullname = req.body.fullname;
        const email = req.body.email;
        const user = await UserModel.findOne({ username: username });
        if (user)
            res.status(409).send('Tên tài khoản đã tồn tại.');
        else {
            const SALT_ROUNDS = 10;
            const hashPassword = bcrypt.hashSync(req.body.password || 'test', SALT_ROUNDS);
            const newUser = {
                username: username,
                password: hashPassword,
                fullname: fullname,
                email: email,
                // ...Thêm các tham số khác tại đây ...
            };
            const createUser = new UserModel(newUser);
            await createUser.save();
            if (!createUser) {
                return res
                    .status(400)
                    .send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
            }
            return res.send({
                username,
            });
        }
    };
    async login(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        console.log('username: ', username, 'password: ', password)
        const user = await UserModel.findOne({ username: username });
        console.log('user: ', user)
        if (!user) {
            return res.status(401).send('Tên đăng nhập không tồn tại.');
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        console.log('validpass: ', isPasswordValid)
        if (!isPasswordValid) {
            return res.status(401).send('Mật khẩu không chính xác.');
        }

        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        const dataForAccessToken = {
            username: user.username,
        };
        const accessToken = await authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            return res
                .status(401)
                .send('Đăng nhập không thành công, vui lòng thử lại.');
        }
        const jwtVariable = {
            refreshTokenSize: 16
        }
        let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
        if (!user.refreshToken) {
            // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
            await UserModel.findOneAndUpdate({ username: user.username }, { refreshToken: refreshToken });
        } else {
            // Nếu user này đã có refresh token thì lấy refresh token đó từ database
            refreshToken = user.refreshToken;
        }
        // res.cookie('accessToken', accessToken);
        // res.cookie('refreshToken', refreshToken);
        // res.setHeader('Set-Cookie', `accessToken=${accessToken}; refreshToken=${refreshToken}`);

        return res.json({
            msg: 'Đăng nhập thành công.',
            accessToken,
            refreshToken,
            user,
        });
    };

    async refreshToken(req, res) {
        // Lấy access token từ header
        // const accessTokenFromHeader = req.headers.x_authorization;
        const accessTokenFromHeader = utils.getCookie('accessToken', req.headers.cookie);
        console.log(accessTokenFromHeader)
        if (!accessTokenFromHeader) {
            return res.status(400).send('Không tìm thấy access token.');
        }

        // Lấy refresh token từ body
        const refreshTokenFromBody = utils.getCookie('refreshToken', req.headers.cookie);
        if (!refreshTokenFromBody) {
            return res.status(400).send('Không tìm thấy refresh token.');
        }

        const accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET;
        const accessTokenLife =
            process.env.ACCESS_TOKEN_LIFE;

        // Decode access token đó
        const decoded = await authMethod.decodeToken(
            accessTokenFromHeader,
            accessTokenSecret,
        );
        console.log('decoded: ', decoded)
        if (!decoded) {
            return res.status(400).send('Access token không hợp lệ.');
        }

        const username = decoded.payload.username; // Lấy username từ payload

        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(401).send('User không tồn tại.');
        }

        if (refreshTokenFromBody !== user.refreshToken) {
            return res.status(400).send('Refresh token không hợp lệ.');
        }

        // Tạo access token mới
        const dataForAccessToken = {
            username,
        };

        const accessToken = await authMethod.generateToken(
            dataForAccessToken,
            accessTokenSecret,
            accessTokenLife,
        );
        if (!accessToken) {
            return res
                .status(400)
                .send('Tạo access token không thành công, vui lòng thử lại.');
        }
        return res.json({
            accessToken,
        });
    };
}

module.exports = new authController;