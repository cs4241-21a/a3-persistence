const dbConnection = 'mongodb+srv://db_user:r3b4kyGnRb4ozP5F@cluster0.gwbts.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const sessionSecret = 'secret';

const GithubClientID = 'ee97a2e12728c24ac616';
const GithubClientSecret = '7862c9e270dc0516a34a13443be7dcb37be2a634';
const GithubCallbackURL = "http://127.0.0.1:3000/auth/github/callback";

module.exports.dbConnection = dbConnection;
module.exports.sessionSecret = sessionSecret;
module.exports.GithubClientID = GithubClientID;
module.exports.GithubClientSecret = GithubClientSecret;
module.exports.GithubCallbackURL = GithubCallbackURL;
