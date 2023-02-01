const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


    //Profile: id,firstName, lastName, profession, balance, type
    //Contract: terms, status
    //Job: description, price, paid, paymentDate
   
    // Changed the end() method to send() to provide a more meaningful error message.
    // Added a status code of 200 to indicate that the request was successful and the contract was found.
/**
 * FIX ME!
 * @returns contract by id
 */


app.get('/contracts/:id', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id } });
    if (!contract) return res.status(404).send({ message: 'Contract not found' });
    res.status(200).json(contract);
  });

/**
 * 
 * @returns Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.
 */


app.get('/contracts', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const profile = req.profile;
    console.log('profile---',profile.firstName)
    const contract = await Contract.findOne({ where: { id } });
    if (!contract) return res.status(404).send({ message: 'Contract not found' });
    res.status(200).json(contract);
  });
module.exports = app;
