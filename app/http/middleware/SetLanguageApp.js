const middleware = require('app/http/middleware/middleware')
const i18n = require('i18n')

class SetLanguageApp extends middleware {

    handel(req, res, next) {
        try {
            let lang = req.signedCookies.lang
            if (i18n.getLocales().includes(lang))
                req.setLocale(lang)
            else
                req.setLocale(i18n.getLocale())
            next()
        } catch (e) {
            next(e)
        }
    }

    findLang(req, res, next) {
        try {
            let lang = req.params.lang
            if (i18n.getLocales().includes(lang))
                res.cookie('lang', lang, {maxAge: 1000 * 60 * 60 * 24 * 90, signed: true})
            res.redirect(req.header('Referer') || '/')
        } catch (e) {
            next(e)
        }
    }
}


module.exports = new SetLanguageApp()