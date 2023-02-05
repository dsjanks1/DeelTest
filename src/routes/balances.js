const express = require('express');

const {depositBalance} = require('../controller/balances.js');

const balanceRouter = express.Router();

balanceRouter.post('/deposit/:userId',depositBalance);

module.exports = balanceRouter
