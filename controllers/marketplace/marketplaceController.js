"use strict"

const axios = require('axios')
const {
    response
} = require('express')

module.exports = {

    index: async (req, res) => {

        let nfts = await getNfts()

        await res.render('./marketplace/marketplace', {
            nfts: nfts
        })

        return
    },

    show: async (req, res) => {

        let contractAdd = req.params.contractAdd
        let tokenId = req.params.tokenId

        let nft = await getSingleNft(contractAdd, tokenId)

        await res.render(`./marketplace/single_item`, {
            nft: nft
        })

        return
    }
}

async function getNfts() {

    try {

        const response = await axios.get(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=50`)

        return response.data.assets

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