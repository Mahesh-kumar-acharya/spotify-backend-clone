const express = require('express')
const authController = require('../controllers/auth.controllers')

const router = express.Router()

router.post('/register', authController.registerUsers)
router.post('/login', authController.loginUsers)

module.exports = router