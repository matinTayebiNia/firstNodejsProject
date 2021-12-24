const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const {validationResult} = require('express-validator/check')
const isMongoId = require('validator/lib/isMongoId');
const sprintf = require('sprintf-js').sprintf;
const Bcrypt = require('bcrypt');


module.exports = class controller {
    constructor() {
        autoBind(this);
        this.recaptchaConfig();
    }

    recaptchaConfig() {
        this.recaptcha = new Recaptcha(
            config.service.recaptcha.site_key,
            config.service.recaptcha.secret_key,
            {...config.service.recaptcha.option});
    }

    recaptchaValidation(req, res) {
        return new Promise((resolve, reject) => {
            this.recaptcha.verify(req, (err, data) => {
                if (err) {
                    req.flash('errors', {
                        'param': 'recaptcha',
                        'msg': 'تیک مربوط به تشخیص رباط وارد نشده لطفا از فعال بودن آن اطمینان حاصل فرمایید '
                    });
                    this.back(req, res)

                } else {
                    resolve(true);
                }
            })
        });
    }

    error(message, status = 500) {
        let err = new Error(message);
        err.status = status;
        throw err;
    }

    isMongoId(paramId) {
        if (!isMongoId(paramId))
            this.error('ای دی وارد شده صحیح نیست', 404);
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }

    getUrlImage(dir) {
        return dir.substring(8);
    }

    async ValidationData(req) {

        const result = validationResult(req);

        if (!result.isEmpty()) {
            const errors = result.array();
            const message = [];
            errors.map(item => {
                message.push({'param': item.param, 'msg': item.msg})
            })
            req.flash('errors', message);
            return false;
        }
        return true;
    }

    back(req, res) {
        req.flash('old', req.body);
            return res.redirect(req.header('Referer') || '/')
    }


    configHeaderRequest() {
        return {
            'cash-control': "no-cash",
            'content-type': "application/json",
            'authorization': "Bearer " + config.payping_token,
            "accept": "application/json",
        };
    }

    getTime(episodes) {
        let sacend = 0;
        episodes.forEach(episode => {
            let time = episode.time.split(':')
            if (time.length === 2) {
                sacend += parseInt(time[0]) * 60;
                sacend += parseInt(time[1]);
            }
            if (time.length === 3) {
                sacend += parseInt(time[0]) * 3600;
                sacend += parseInt(time[1]) * 60;
                sacend += parseInt(time[2]);
            }
        })

        let minutes = Math.floor(sacend / 60);
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;

        sacend = Math.floor(((sacend / 60) % 1) * 60)
        console.log(sacend);
        return sprintf('%02d:%02d:%02d', hours, minutes, sacend);
    }

    checkHash(req, episode) {
        let timestamps = new Date().getTime();
        if (req.query.t < timestamps) return false;

        let text = process.env.SECRET_KEY_URL + episode.id + req.query.t;
        return Bcrypt.compareSync(text, req.query.mac);
    }

    alert(req, data) {
        let title = data.title || '',
            message = data.message || '',
            iconInfo = data.icon || '',
            button = data.button || null,
            timer = data.timer || 2000,
            toast = data.toast || false;
        req.flash('sweetAlert', {title, message, iconInfo, button, timer, toast});
    }
}

