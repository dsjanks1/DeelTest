const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require("sequelize");
const httpStatus = require('http-status');
const {sequelize} = require('../model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
const balanceService = require('../services/balance.js');

const depositBalance = async (req, res) => {
    try {
        const response = await balanceService.depositBalance(req);
        if (response && response.includes('Maximum deposit')){
            return res.status(httpStatus.METHOD_NOT_ALLOWED).send({ message: 'Maximum deposit amount reached. Deposit 300 is more than 25% of client 2 total of jobs to pay' });
        }
        if (!response) {
            return res.status(httpStatus.NOT_FOUND).send({ message: 'No deposit allowed' });
        }
        return res.status(httpStatus.OK).json(response);
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
 };
    

module.exports = {
    depositBalance,
}