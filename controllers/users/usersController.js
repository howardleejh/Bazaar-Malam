"use strict"

const {
    UserModel
} = require('../../models/users')

const {
    TransactionModel
} = require('../../models/transactions')

const axios = require('axios')

const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {

    signedInUser: async (req, res) => {

        let user = null

        try {
            user = await UserModel.findOne({
                email: req.body.user_email
            })

        } catch (err) {
            console.log(err)
            res.send(err)
            return
        }

        if (!user) {
            res.redirect('/signup')
            return
        }

        const isValidPassword = await bcrypt.compare(req.body.user_password, user.hash)
        if (!isValidPassword) {
            res.redirect('/signup')
            return
        }

        req.session.user = user

        res.redirect('/marketplace')
    },

    dashboard: async (req, res) => {

        let user = await UserModel.findOne({
            email: req.session.user.email
        })

        let userAssets = await TransactionModel.find({
            item_owner: user._id
        })

        let currencyRate = await getCurrencyRate()

        let bitcoin = currencyRate.data.coins[0].price

        let ethereum = currencyRate.data.coins[1].price

        await res.render('./users/dashboard', {
            userAssets,
            btcRate: bitcoin,
            ethRate: ethereum
        })
    },

    editAccount: async (req, res) => {

        const generatedHash = await bcrypt.hash(req.body.password, saltRounds)

        if (req.body.password.length !== 0) {

            await UserModel.findOneAndUpdate({
                    email: req.body.email
                }, {
                    $set: {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        display_name: req.body.display_name,
                        hash: generatedHash,
                        email: req.body.email,
                        address: {
                            add1: req.body.add_1,
                            add2: req.body.add_2,
                            postal: req.body.postal,
                            country: req.body.country
                        }
                    }

                }, {
                    new: true
                })
                .then(response => {

                    req.session.user = user

                    res.redirect('/users/dashboard')

                })
                .catch(err => {
                    console.log(err)
                    res.send("db error")
                })

        } else {

            await UserModel.findOneAndUpdate({

                    email: req.body.email
                }, {
                    $set: {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        display_name: req.body.display_name,
                        email: req.body.email,
                        address: {
                            add1: req.body.add_1,
                            add2: req.body.add_2,
                            postal: req.body.postal,
                            country: req.body.country
                        }
                    }
                }, {
                    new: true
                })
                .then(response => {

                    res.redirect('/users/dashboard')

                })
                .catch(err => {
                    console.log(err)
                    res.send("db error")
                })
        }
    },

    deleteAccount: async (req, res) => {

        let user = await UserModel.deleteOne({
            email: req.session.user.email
        })

        res.redirect('/marketplace')
    },

    purchaseItem: async (req, res) => {

        let user = req.session.user

        let itemCheck = await TransactionModel.findOne({
            item_api_tokenId: req.params.tokenId
        })

        let itemVal = {
            cash: parseFloat(req.body.cashPurchase),
            bitcoin: parseFloat(req.body.bitcoinPurchase),
            ethereum: parseFloat(req.body.ethereumPurchase)
        }

        let payment = {
            cash: parseFloat(user.wallet.cash_balance["$numberDecimal"]) - nullCheck(itemVal.cash),
            bitcoin: parseFloat(user.wallet.bitcoin_balance["$numberDecimal"]) - nullCheck(itemVal.bitcoin),
            ethereum: parseFloat(user.wallet.ethereum_balance["$numberDecimal"]) - nullCheck(itemVal.ethereum)
        }

        if (itemCheck) {

            res.send(`You already owns this item.`)

        } else if (payment.cash <= 0 || payment.bitcoin <= 0 || payment.ethereum <= 0)

        {

            res.send(`Sorry you do not have enough funds.`)

        } else {

            let item = await getSingleNft(req.params.contractAdd, req.params.tokenId)

            try {
                await TransactionModel.create({
                    item_name: item.name,
                    item_value: {
                        cash: parseFloat(req.body.cashPurchase),
                        bitcoin: parseFloat(req.body.bitcoinPurchase),
                        ethereum: parseFloat(req.body.ethereumPurchase)
                    },
                    item_current_bid: {
                        cash: 0,
                        bitcoin: 0,
                        ethereum: 0
                    },
                    item_status: "BUY",
                    item_owner: user._id,
                    item_api_contractAdd: req.params.contractAdd,
                    item_api_tokenId: req.params.tokenId,
                    item_image: item.image_url
                })

            } catch (err) {

                console.log(err)
                res.redirect('/signup')
                return
            }

            try {

                await UserModel.findOneAndUpdate({
                    email: user.email
                }, {
                    $set: {
                        wallet: {
                            cash_balance: nullCheck(payment.cash),
                            bitcoin_balance: nullCheck(payment.bitcoin),
                            ethereum_balance: nullCheck(payment.ethereum)
                        }
                    }

                }, {
                    new: true
                })
            } catch (err) {

                console.log(err)
                res.redirect('/marketplace')
                return
            }

            res.redirect(`/marketplace/show/${req.params.contractAdd}/${req.params.tokenId}`)
        }
    },

    updateItem: async (req, res) => {

        let userItem = await TransactionModel.findOne({
            item_api_tokenId: req.params.tokenId
        })

        let nft = await getSingleNft(userItem.item_api_contractAdd, userItem.item_api_tokenId)

        await res.render('./users/user_item', {
            nft,
            userItem
        })
    },

    signOut: (req, res) => {

        req.session.destroy()
        res.redirect('/marketplace')
    }
}

async function getCurrencyRate() {


    try {

        const response = await axios.get(`https://coinlib.io/api/v1/coin?key=47083687c1eef63c&pref=USD&symbol=BTC, ETH`)

        return response

    } catch (err) {

        console.log(err)
    }
}

async function getSingleNft(contractAdd, tokenId) {

    try {

        const response = await axios.get(`https://api.opensea.io/api/v1/asset/${contractAdd}/${tokenId}`)

        return response.data

    } catch (err) {

        console.log(err)
    }
}

function twoDecimal(val) {

    let valFloat = parseFloat(val)

    return valFloat.toLocaleString('en-US', {
        maximumFractionDigits: 2
    })

}

function nullCheck(val) {

    if (isNaN(val)) {

        let message = 0

        return message

    } else {

        return val
    }

}