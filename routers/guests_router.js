const express = require('express')

const router = express.Router()

const {
    authenticatedOnly,
    guestOnly,
    setUserVarMiddleware
} = require('../middleware/auth_middleware')

const guestsController = require('../controllers/guests/guestsController')

// New Member Signup

router.get('/signup', guestOnly, guestsController.signUp)

// Create New Member

router.post('/signup', guestOnly, guestsController.register)

module.exports = router