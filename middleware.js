
module.exports.checkLogin = (req, res, next) => {
    // Already logged in
    if (req.cookies.loginCookie) {
        res.redirect(`/user/${req.cookies.loginCookie.userId}`);
        return;
    }

    next();
}