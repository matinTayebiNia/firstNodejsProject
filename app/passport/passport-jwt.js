const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require('app/models/user');

const ExtractJWT = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromHeader("authentication")
    ]),
    
    secretOrKey: config.secretKayJwt,

}, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);
        if (user) done(null, user)
        else done(null, false, {data: "شما اجازه دسترسی ندارید"})
    } catch (e) {
        done(null, false, {data: e.message})
    }
}))