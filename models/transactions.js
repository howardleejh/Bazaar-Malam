"use strict"

const mongoose = require('mongoose');

//=========================================
//         Schema Creation
//=========================================


const transactionSchema = new mongoose.Schema({

    item_name: {
        type: String,
        required: true,
        max: 100
    },
    item_value: {
        cash: {
            type: mongoose.Schema.Types.Decimal128
        },
        bitcoin: {
            type: mongoose.Schema.Types.Decimal128
        },
        ethereum: {
            type: mongoose.Schema.Types.Decimal128
        }
    },
    item_current_bid: {
        cash: {
            type: mongoose.Schema.Types.Decimal128
        },
        bitcoin: {
            type: mongoose.Schema.Types.Decimal128
        },
        ethereum: {
            type: mongoose.Schema.Types.Decimal128
        }
    },
    item_status: {
        type: String,
    },
    item_owner: {
        type: String,
    },
    item_api_contractAdd: {
        type: String,
        required: true
    },
    item_api_tokenId: {
        type: String,
        required: true
    },
    item_image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const transactionModel = mongoose.model('transaction', transactionSchema);

module.exports = {
    TransactionModel: transactionModel
}