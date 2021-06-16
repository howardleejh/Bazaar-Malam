"use strict"

const {
    UserModel
} = require('../../models/users')

const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {

    index: (req, res) => {

        res.render('index')
    },

    signIn: (req, res) => {

        res.render('./guests/signin')
    },

    signUp: (req, res) => {

        res.render('./guests/signup')
    },

    register: async (req, res) => {

        if (!req.body.first_name || !req.body.last_name) {
            res.send('Please input First and Last Name')
            return
        }

        // ensure password and confirm password matches
        if (req.body.password !== req.body.passwordConfirm) {
            res.send('Please ensure password matches')
            return
        }

        // ensure that there is no existing user account with the same email given
        let user = null
        try {
            user = await UserModel.findOne({
                email: req.body.email
            })
        } catch (err) {
            console.log(err)
            res.redirect('/guests/signup')
            return
        }
        if (user) {
            res.send(`email exists, please use another email.`)
            return
        }

        const generatedHash = await bcrypt.hash(req.body.password, saltRounds)

        try {
            await UserModel.create({
                first_name: capitalize(req.body.first_name),
                last_name: capitalize(req.body.last_name),
                display_name: capitalize(req.body.first_name),
                email: req.body.email,
                hash: generatedHash,
                address: {
                    add1: "",
                    add2: "",
                    postal: "",
                    country: ""
                },
                wallet: {
                    cash_balance: "0",
                    bitcoin_balance: "0",
                    ethereum_balance: "0",
                },
                assets: 0,
                asset_value: "0",
                transactions: 0
            })
        } catch (err) {
            console.log(err)
            res.redirect('/guests/signup')
            return
        }

        res.redirect('/users/marketplace')
    }
}

function capitalize(str) {

    return str[0].toUpperCase() + str.slice(1);
}

async function getCurrencyRate() {


    try {

        const response = await axios.get(`https://coinlib.io/api/v1/coin?key=${process.env.COINLIB_KEY}&pref=USD&symbol=BTC, ETH`)

        return response

    } catch (err) {

        console.log(err)
    }
}