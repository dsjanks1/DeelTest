const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require("sequelize");
const httpStatus = require('http-status');
const {sequelize} = require('../model')
const {getProfile} = require('../middleware/getProfile');
const e = require('express');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
const ContractService = require('../services/contract.js');

const getContractByID = async (req, res) => {
    try {
        const contract = await ContractService.getNonTerminatedUserContracts(req);
        if (!contract) {
            return res.status(httpStatus.NOT_FOUND).send({ message: 'Contract not found' });
        }
        return res.status(httpStatus.OK).json(contract);
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
 };
    
  //Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.
  const getNonTerminatedUserContracts = async (req, res) => {
    try {
        const contract = await ContractService.getNonTerminatedUserContracts(req);
        if (!contract) {
            return res.status(httpStatus.NOT_FOUND).send({ message: 'Contracts not found' });
        }
        return res.status(httpStatus.OK).json(contract);
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
 };

module.exports = {
    getContractByID,getNonTerminatedUserContracts
}