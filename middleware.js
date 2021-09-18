
module.exports.checkLogin = (req, res, next) => {
    // Already logged in
    if (req.cookies.loginCookie) {
        res.redirect(`/user/${req.cookies.loginCookie.userId}`);
        return;
    }

    next();
}

module.exports.checkAuth = (req, res, next) => {

    const gitauth = req.isAuthenticated();
    const myauth = !req.cookies.loginCookie

    // not logged in
    if (myauth && !gitauth) {
        res.redirect(`/login`);
        return;
    }

    return next();
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    
  }