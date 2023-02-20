const { Op } = require('sequelize');
const { Contract, Job, Profile } = require('../model');

const getBestProfession = async (req) => {
    const {start,end} = req.params;
    const sequelize = req.app.get('sequelize');
  
    const bestProfessions = await Profile.findAll({
      attributes: ['profession', [sequelize.fn('SUM', sequelize.col('price')), 'earned']],
      include: [
        {
          model: Contract,
          as: 'Contractor',
          attributes: [],
          required: true,
          include: [
            {
              model: Job,
              required: true,
              attributes: [],
              where: {
                paid: true,
                paymentDate: {
                  [Op.gte]: start,
                  [Op.lte]: end,
                },
              },
            },
          ],
        },
      ],
      where: {
        type: 'contractor',
      },
      group: ['profession'],
      order: [[sequelize.col('earned'), 'DESC']],
      limit: 1,
      subQuery: false,
    });
  
    return bestProfessions[0];
  };


  const getBestClients = async (req) => {
    const {start,end, limit = 2} = req.params;
    const sequelize = req.app.get('sequelize');
    
    const bestClients = await Job.findAll({
      attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
      order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
      group: ['Contract.Client.id'],
      limit,
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Contract,
          attributes: ['id'],
          include: [
            {
              model: Profile,
              as: 'Client',
              where: { type: 'client' },
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        },
      ],
    });

      return bestClients.map((groupedJobs) => ({
        paid: groupedJobs.paid,
        id: groupedJobs.Contract.Client.id,
        fullName: `${groupedJobs.Contract.Client.firstName} ${groupedJobs.Contract.Client.lastName}`,
      }));
  };
  
  module.exports = {
    getBestProfession,getBestClients
  };
  