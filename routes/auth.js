const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')
const {verifyAccessToken, verifyRefreshToken} = require('../middlewares/auth')

router.post('/register', authController.register);

router.post('/login', authController.login)

router.post('/token', verifyRefreshToken, authController.getAccessToken)

router.post ('/logout', verifyAccessToken, authController.logout)

module.exports = router

