
//Changed req.params.id || 0 to req.params.id to prevent querying the database with 0 as the id value, which might return unexpected results.
//Changed the status code from 401 to 404 to indicate that the profile was not found instead of indicating unauthorized access.
//Changed the end() method to send() to provide more meaningful error message.
const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models');
    const profile = await Profile.findOne({ where: { id: req.params.id } });
    if (!profile) return res.status(404).send('Profile not found');
    req.profile = profile;
    next();
  };


module.exports = {getProfile}