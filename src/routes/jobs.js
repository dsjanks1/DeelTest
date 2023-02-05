const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const {getActiveUnpaidJobs, clientPay} = require('../controller/jobs.js'); 

const jobsRouter = express.Router();

// 1. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.
jobsRouter.get('/unpaid/:id', getProfile, getActiveUnpaidJobs);
jobsRouter.post('/:job_id/pay', getProfile, clientPay);


module.exports = jobsRouter
