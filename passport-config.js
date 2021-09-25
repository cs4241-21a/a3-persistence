const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport,getUserByUsername){
    const authentication = async (username, password, done) => {
        const user = getUserByUsername(username)
        if (user == null) {
            return done(null, false, {message: 'account with the username does not exist'})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null,user)
            }else{
                return done(null,false,{message:'password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({username : 'username'}, authentication))
}

module.exports = initialize