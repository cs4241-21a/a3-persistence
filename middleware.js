
module.exports.checkLogin = (req, res, next) => {

    const gitauth = req.isAuthenticated();

    // Already logged in
    if (req.cookies.loginCookie) {
        res.redirect(`/user/${req.cookies.loginCookie.userId}`);
        return;
    } else if (gitauth) {
        res.redirect(`/user/${req.user._id}`);
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
