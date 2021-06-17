<h1>Bazaar Malam</h1>

<h2>Description</h2>

This is yet another first for me, with the establishment of a digital Marketplace for NFTs shopping. I've included 2 main cryptocurrencies as well that can be used
to purchase NFTs.

<br />

The project is currently live on Heroku: https://bazaar-malam.herokuapp.com/

<br />

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /         | GET       | index  
| /guests/signup         | GET       | new   
| /guests/signup        | POST      | create
| /marketplace/     | GET       | marketplace index   
| /marketplace/show/:contractAdd/:tokenId      | GET       | show       
|/users/signin      |GET        | user sign in 
|/users/dashboard      |POST        | user signed in   
| /users/account/edit      | PATCH/PUT | update user info    
| /users/account/delete      | DELETE    | destroy user account

<br />

Some Dependecies that I've used in this project:

- Axios: used to access API callbacks
- Bcrpyt: used for encryption of data
- DotEnv: a local environment that stores sensative data
- EJS : Javascript templating
- Express: NodeJS web application framework
- Express Session: allows users to store data in sessions
- Method Override
- Mongoose: Object Data Modeling (ODM) library for NodeJS and MongoDB

<br />

<h3>Features</h3>

- Home Page
- Marketplace
- User Signup/Login
- User Settings
- User Dashboard
- Wallet Topup
- Cryptocurrency exchange charts
- User Assets
- NFT Bidding
- NFT BUY/SELL

<br />

<h4>Some features to be implemented or improved upon: </h4>

- [ ] NFT BUY/SELL<br />
- [ ] NFT Bidding<br />
- [ ] Express Flash Messages<br />
- [ ] Simple Centralized Blockchain<br />




