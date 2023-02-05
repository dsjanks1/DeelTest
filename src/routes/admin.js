const express = require('express');
const { getBestProfession,getBestClients } = require('../controller/admin.js');

const contractRouter = express.Router();

// Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
contractRouter.get('/best-profession/:start/:end', getBestProfession);
contractRouter.get('/best-clients/:start/:end/:limit', getBestClients);
module.exports = contractRouter;
