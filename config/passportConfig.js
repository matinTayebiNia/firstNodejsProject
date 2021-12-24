const passport = require('passport');
const Helpers = require('app/Helpers')
const gate = require('app/Helpers/gate')
const i18n = require('i18n')
const rememberLogin = require('app/http/middleware/rememberToken');

module.exports = (app) => {
    //set passport strategy
    require('app/passport/passport-google')
    require('app/passport/passport-local');
    require('app/passport/passport-jwt');

    //use passport package in app
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(rememberLogin.handel);
    app.use(gate.middleware())
    i18n.configure({
        locales: ['en', 'fa'],
        directory: config.layout.locales_directory,
        defaultLocale: "fa",
        cookie: 'lang',
    })
    app.use(i18n.init)
    app.use((req, res, next) => {
        app.locals = new Helpers(req, res).getUser();
        next();
    })

}