const express = require('express');


const { getProfile } = require('../middleware/getProfile');
const {getContractByID,getNonTerminatedUserContracts} = require('../controller/contract.js');

const contractRouter = express.Router();

contractRouter.get('/:id', getProfile, getContractByID);
contractRouter.get('/', getProfile, getNonTerminatedUserContracts);

module.exports = contractRouter
