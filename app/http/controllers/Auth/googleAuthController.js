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
            this.alert(req)
                .setTitle("موفقیت")
                .setMessage("ورود شما از اکانت گوگل موفقیت آمیز بود")
                .setIcon("success")
                .build();
            return res.redirect('/');
        })(req, res, next);
    }
}

module.exports = new googleAuthController();