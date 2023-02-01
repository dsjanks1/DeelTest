const { Op } = require('sequelize');

//Profile: id,firstName, lastName, profession, balance, type
//Contract: terms, status
//Job: description, price, paid, paymentDate

// Changed the end() method to send() to provide a more meaningful error message.
// Added a status code of 200 to indicate that the request was successful and the contract was found.

const getContractById = async (req) => {
    const { Contract } = req.app.get('models');
    const contract = await Contract.findOne({
      where: {
        id: req.params.id,
      },
    });
    return contract;
  };

const getNonTerminatedUserContracts = async (req) => {
    const { Contract } = req.app.get('models');
    const profileId = req.profile.id;
    let contracts;
    // determine if profile is a client or contractor
    if (req.profile.type === 'client') {
        try {
            contracts = await Contract.findAll({
                where: {
                    ClientId: profileId,
                    status: {
                    [Op.notIn]: ['terminated'],
                    },
                },
            });
        }
        catch(err){
            console.log(err);
        }

    } else {
        contracts = await Contract.findAll({
            where: {
            ContractorId: profileId,
            status: {
                [Op.notIn]: ['terminated'],
                },
            },
        });
    }
    return contracts;
    };


  module.exports = { getContractById, getNonTerminatedUserContracts };
