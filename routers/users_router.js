const express = require('express')

const router = express.Router()

const {
    authenticatedOnly,
    guestOnly,
    setUserVarMiddleware
} = require('../middleware/auth_middleware')

const usersController = require('../controllers/users/usersController')

const guestsController = require('../controllers/guests/guestsController')

// Sign In

router.get('/signin', guestOnly, guestsController.signIn)

// Signed In User

router.post('/dashboard', usersController.signedInUser)

// Show Dashboard

router.get('/dashboard', authenticatedOnly, usersController.dashboard)

// Update User Details

router.patch('/account/edit', authenticatedOnly, usersController.editAccount)

// Delete User 

router.delete('/account/delete', authenticatedOnly, usersController.deleteAccount)

// User Sign Out

router.post('/signout', usersController.signOut)

// Show User Purchased Item

router.post('/marketplace/show/:contractAdd/:tokenId/purchase', authenticatedOnly, usersController.purchaseItem)

// Edit User Purchased Item

router.get('/show/:contractAdd/:tokenId', authenticatedOnly, usersController.updateItem)

// Topup User Wallet

// router.post('/dashboard/topup', authenticatedOnly, usersController.topUpWallet)


module.exports = router