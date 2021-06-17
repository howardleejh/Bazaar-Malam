"use strict"

// =====================================
//           Dependencies
// =====================================
require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')

const guestsController = require('./controllers/guests/guestsController')
const marketplaceController = require('./controllers/marketplace/marketplaceController')

// =====================================
//              Routers
// =====================================

const guestsRouter = require('./routers/guests_router')
const usersRouter = require('./routers/users_router')


const {
    authenticatedOnly,
    guestOnly,
    setUserVarMiddleware
} = require('./middleware/auth_middleware')

const app = express()
const port = process.env.PORT || 3000

// =====================================
//          Using Middleware
// =====================================

// setting middleware to accept json and urlencoded request body

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// setting middleware to accept spoofed methods based on _method query parameter

app.use(methodOverride('_method'))

// setting up "public" folder for use of static files

app.use(express.static('public'))


// =====================================
//         Session Middleware
// =====================================

// setting up middleware to support session

app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    name: "user_session",
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        secure: false,
        maxAge: 3600000
    } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))

app.use(setUserVarMiddleware)

// =====================================
//              Set Engine
// =====================================

app.set('view engine', 'ejs');

// =====================================
//               Routes
// =====================================


// Index

app.get('/', guestsController.index)

// Market Index

app.get('/marketplace', marketplaceController.index)

// Show 

app.get('/marketplace/show/:contractAdd/:tokenId', marketplaceController.show)

// Guests Route

app.use('/guests', guestsRouter)

// Users Route

app.use('/users', usersRouter)


// =====================================
//         Initialize MongoDB
// =====================================

mongoose.set('useCreateIndex', true)

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

const db = mongoose.connection

// Once DB Connection is successfully established, do something

db.once('open', () => {

    console.log('MongoDB connection successful')

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    })
})

db.on('error', () => {
    console.log('MongoDB connection failed')
})