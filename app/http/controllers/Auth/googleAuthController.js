const Controller = require('app/http/controllers/controller')
const passport = require('passport');

class googleAuthController extends Controller {

    googleAuth(req, res, next) {
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })(req, res, next)
    }

    callbackGoogleAuth(req, res, next) {
        passport.authenticate('google', (err, user) => {
            if (err) return res.redirect('/auth/register')
            if (!user) return res.redirect('/auth/register')
            user.setRememberToken(res);
            this.alert(req, {
                toast: false,
                title: "موفقیت",
                message: "ورود شما از اکانت گوگل موفقیت آمیز بود",
                icon: "success",
            })
            return res.redirect('/');
        })(req, res, next);
    }
}

module.exports = new googleAuthController();