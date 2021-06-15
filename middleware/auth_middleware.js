"use strict"

module.exports = {

    authenticatedOnly: (req, res, next) => {

        // if session is valid, go to the next stage

        if (req.session && req.session.user) {

            next()

            return
        }

        res.redirect('/users/signin')
    },
    guestOnly: (req, res, next) => {

        // if user not logged in, allow request to proceed.

        if (!req.session || !req.session.user) {

            next()

            return
        }

        res.redirect('/users/dashboard')
    },
    setUserVarMiddleware: (req, res, next) => {

        res.locals.user = null

        if (req.session && req.session.user) {

            res.locals.user = req.session.user
        }

        next()
    }

}