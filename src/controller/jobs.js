const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require("sequelize");
const httpStatus = require('http-status');
const {sequelize} = require('../model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const JobService = require('../services/jobs.js');

const getActiveUnpaidJobs = async (req, res) => {
        const jobs = await JobService.getActiveUnpaidJobs(req);
        if (!jobs || jobs.length === 0) {
            return res.status(httpStatus.NOT_FOUND).send({ message: 'No jobs found' });
        }
        return res.status(httpStatus.OK).json(jobs);
 };

 const clientPay = async (req, res) => {

        const jobs = await JobService.clientPay(req);
        if (!jobs) {
            return res.status(httpStatus.NOT_FOUND).send({ message: 'No jobs found' });
        }
        return res.status(httpStatus.OK).json(jobs);

 };


 module.exports = {
    getActiveUnpaidJobs,clientPay
}