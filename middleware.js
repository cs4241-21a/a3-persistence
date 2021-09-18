
module.exports.checkLogin = (req, res, next) => {

    const gitauth = req.isAuthenticated();

    // Already logged in
    if (gitauth || req.cookies.loginCookie) {
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
