const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require("sequelize");

const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile');
const e = require('express');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


const contractRoutes = require( './routes/contract.js');
const jobRoutes = require( './routes/jobs.js');

app.use('/contracts', contractRoutes);
app.use('/jobs', jobRoutes);

module.exports = app;
