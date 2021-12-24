const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('app/models/user');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new GoogleStrategy({
        clientID: config.service.google.client_id,
        clientSecret: config.service.google.client_secret,
        callbackURL: config.service.google.callback_url
    },
    function (token, tokenSecret, profile, done) {
        User.findOne({email: profile.emails[0].value}, (err, user) => {
            if (err) return done(err);
            if (user) return done(null, user);

            const newUser = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: profile.id
            });
            newUser.save(err => {
                if (err) return done(err, false, req.flash('errors', 'ورود اکانت گوگل با موفقیت انجام نشد لطفا به صورت دستی عضو سایت شوید یا در زمان دیگر دوباره امتحان کنید'));
                done(null, newUser)
            });
        })
    }
));
