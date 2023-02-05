const { Op } = require('sequelize');

const getBestProfession = async (req) => {
    const { Job, Contract, Profile } = req.app.get('models');
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
    const {Contract, Profile} = req.app.get('models');
    const {start,end, limit = 2} = req.params;
    const sequelize = req.app.get('sequelize');

    const bestClients = await Job.findAll({
        attributes: ['client',[sequelize.fn('SUM', sequelize.col('price')), 'paid']],
        include: [
          {
            model: Contract,
            as: 'Contractor',
            required:true,
            attributes: [''],
            include: [
              {
                model: Profile,
                where: {
                type: 'client' ,
                attributes: ['id'],
                paid: true,
                paymentDate: {
                  [Op.between]: [start, end],
                },
              },
                attributes: ['id', 'firstName', 'lastName'],
              },
            ],
          },
        ],
        where: {
          type: 'client'
        },
        group: ['client'],
        order: [[sequelize.fn('SUM', sequelize.col('price')), 'DESC']],
        limit,
        subQuery: false,
      });

      return bestClients;
  };
  
  module.exports = {
    getBestProfession,getBestClients
  };
  