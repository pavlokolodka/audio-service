module.exports = (req, res, next) => {
  res.locals.isAuth = req.session.isAuthenticated;
  next()
}