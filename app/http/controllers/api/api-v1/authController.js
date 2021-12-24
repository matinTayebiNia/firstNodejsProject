const controller = require('app/http/controllers/api/controller')
const passport = require("passport")
const jsonWebToken = require("jsonwebtoken")

class AuthController extends controller {

    async login(req, res, next) {
        try {
            if (!await this.ValidationData(req, res)) return;
            passport.authenticate("local.login", {
                session: false,
            }, (err, user) => {
                if (err) this.failed(err.message, res, 404)
                if (!user) this.failed("چنین کاربری وجود ندارد", res)


                req.login(user, {session: false}, (err) => {
                    if (err) this.failed(err.message, res, 404)
                    //create token
                    const token = jsonWebToken.sign({
                        id: user.id,
                    }, config.secretKayJwt, {
                        expiresIn: 60 * 60 * 24
                    })

                    //return token
                    return res.json({
                        data: {
                            token
                        },
                        status: "success"
                    })
                })
            })(req, res, next)
        } catch (e) {
            this.failed(e.message, res)
        }
    }


}


module.exports = new AuthController();