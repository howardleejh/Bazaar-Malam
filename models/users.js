"use strict"

const mongoose = require('mongoose');

//=========================================
//         Schema Creation
//=========================================


const userSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true,
        max: 100
    },
    last_name: {
        type: String,
        required: true,
        max: 100
    },
    display_name: {
        type: String,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    address: {
        add1: {
            type: String
        },
        add2: {
            type: String
        },
        postal: {
            type: String
        },
        country: {
            type: String
        }
    },
    wallet: {
        cash_balance: {
            type: mongoose.Schema.Types.Decimal128
        },
        bitcoin_balance: {
            type: mongoose.Schema.Types.Decimal128
        },
        ethereum_balance: {
            type: mongoose.Schema.Types.Decimal128
        },
    },
    assets: {
        type: Number
    },
    asset_value: {
        type: mongoose.Schema.Types.Decimal128
    },
    transactions: {
        type: Number
    }
}, {
    timestamps: true
})

const userModel = mongoose.model('user', userSchema);

module.exports = {
    UserModel: userModel
}