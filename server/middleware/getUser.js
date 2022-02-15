const User = require('../models/user')

module.exports = async function(req, res, next) {
  if(!req.session.user) {
    return next()
  }
  res.locals.name = req.session.user.name;
  req.user = await User.findById(req.session.user._id)
  next()
}