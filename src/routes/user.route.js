const express = require('express');
const router = express.Router();
const userController = require("../app/controllers/userController")


const authMiddleware = require('../app/middlewares/auth.middlewares');

const isAuth = authMiddleware.isAuth;

router.get('/profile', isAuth, userController.getProfile);

// router.post(`/users`, userController.getUsers);
module.exports = router;