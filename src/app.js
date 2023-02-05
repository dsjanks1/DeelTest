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
const balanceRoutes = require('./routes/balances.js')
const adminRoutes = require('./routes/admin.js')

app.use('/contracts', contractRoutes);
app.use('/jobs', jobRoutes);
app.use('/balance', balanceRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
