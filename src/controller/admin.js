const httpStatus = require('http-status');

const adminService = require('../services/admin.js');

const getBestProfession = async (req, res) => {
  try {
    const foundBestProfession = await adminService.getBestProfession(req);

    if (!foundBestProfession) {
      res.status(httpStatus.NOT_FOUND).json({ message: 'No best profession found' });
    } else {
      res.status(httpStatus.OK).json(foundBestProfession);
    }
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error occurred while finding best profession', error });
  }
};

module.exports = {
  getBestProfession,
};
