const express = require('express');
const router = express.Router();
const { userController } = require('../controllers')
const { verifyToken } = require('../middlewares')

router.post('/forgot-password',verifyToken.accessToken,userController.forgot_password);
router.post('/reset-password',verifyToken.accessToken,userController.reset_password);

module.exports = router;