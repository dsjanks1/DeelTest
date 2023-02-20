const { Op } = require('sequelize');


const getActiveUnpaidJobs = async (req) => {
    const { Job, Contract } = req.app.get('models');
    const profileId = req.profile.id;

    try {
      const activeUnpaidJobs = await Job.findAll({
        include: [
            {
                model: Contract,
                required: true,
                where: {
                    [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
                    status: 'in_progress',
                },
            },
        ],
        where: {
            [Op.or]: [{ paid: false }, { paid: null }],
        },
    });
    
    return activeUnpaidJobs;
    }
    catch(err){
      return err;
    }

  };

  const clientPay = async (req) => {
    const { Contract, Job, Profile } = req.app.get('models');
    const { id, balance, type } = req.profile;
    const jobId = req.params.id;
    const sequelize = req.app.get('sequelize');
  
    let response = '';

    // find an active job based on jobId provided
    try{
      const job = await Job.findOne({
        where: { id: jobId, paid: { [Op.is]: null } },
        include: [
          {
            model: Contract,
            where: { status: 'in_progress', ClientId: id },
          },
        ],
      });

    // Check job exists and is type client
    if (job) {
      if (type == 'client') {
        const amountToBePaid = job.price;
        const contractorId = job.Contract.ContractorId;
        if (balance >= amountToBePaid) {
          const paymentTransaction = await sequelize.transaction();
          try {
            await Promise.all([
              Profile.update(
                { balance: sequelize.literal(`balance - ${amountToBePaid}`) },
                { where: { id } },
                { transaction: paymentTransaction },
              ),
  
              Profile.update(
                { balance: sequelize.literal(`balance + ${amountToBePaid}`) },
                { where: { id: contractorId } },
                { transaction: paymentTransaction },
              ),
  
              Job.update(
                { paid: 1, paymentDate: new Date() },
                { where: { id: jobId } },
                { transaction: paymentTransaction },
              ),
            ]);
  
            await paymentTransaction.commit();
  
            response = `A successful payment of:${amountToBePaid} has been made for job: ${job.description}`;
          } catch (error) {
            await paymentTransaction.rollback();
  
            response = `Payment failure of ${amountToBePaid} for ${job.description}`;
          }
        }
      }
    } else {
      response = `No job exists`;
    }
  }catch(err){
        return err;
  }
    return response;
  };


  module.exports = {getActiveUnpaidJobs, clientPay};
