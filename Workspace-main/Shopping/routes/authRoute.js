const { authController } = require('../controllers')
const { verifyToken } = require('../middlewares')
const express = require('express')
const router = express.Router()

router.post('/register/', authController.create_user)
router.get('/login/', verifyToken.accessToken, authController.login_user)
router.post('/logout/', verifyToken.accessToken,authController.logout_user)

module.exports = router;
