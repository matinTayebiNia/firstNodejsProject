const Controller = require('app/http/controllers/controller')
const passport = require('passport');
const ActivationCode = require("app/models/activaionCode")

class loginController extends Controller {
    showLoginForm(req, res) {
        const title = 'صفحه ورود';

        res.render('home/auth/login', {
            recaptcha: this.recaptcha.render(),
            title
        });
    }

    async loginProccess(req, res, next) {
        await this.recaptchaValidation(req, res);
        let result = await this.ValidationData(req);
        if (result) return this.login(req, res, next)
        return this.back(req, res);
    }

    async login(req, res, next) {
        passport.authenticate('local.login', async (err, user) => {
            if (!user) return res.redirect('/auth/login')

            //checking user is active
            await ActivationCode().userHasActivationCode(user)

            req.logIn(user, err => {
                if (req.body.remember) {
                    user.setRememberToken(res);
                }
                this.alert(req, {
                    toast: false,
                    title: "موفقیت",
                    message: "شما با موفقیت وارد سیستم شدید",
                    icon: "success",
                })
                return this.back(req, res);
            })
        })(req, res, next);
    }

    logout(req, res) {
        req.logout();
        this.clearRememberCookie(req, res);
        this.alert(req, {
            toast: true,
            title: "شما با موفقیت از سیستم خارج شدید",
            icon: "success",
        })
        res.redirect('/');
    }

    clearRememberCookie(req, res) {
        if (req.signedCookies.remember_token)
            res.clearCookie('remember_token');
    }
}

module.exports = new loginController();