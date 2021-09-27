module.exports = (req, res, next) => {
    if (req.user && req.user.emails && req.user.emails[0]) {
      next()
    } else {
      res.redirect('/auth/login')
    }
}
