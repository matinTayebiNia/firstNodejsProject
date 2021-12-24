const path = require('path')
const autoBind = require('auto-bind');
const momentJalaali = require('moment-jalaali')
momentJalaali.loadPersian({
    usePersianDigits: true,
    dialect: 'persian-modern'
})

module.exports = class Helpers {
    constructor(req, res) {
        autoBind(this)
        this.req = req;
        this.res = res;
        this.FormData = req.flash('old')[0];
        this.errorsData = req.flash('errors');
    }

    getUser() {
        return {
            auth: this.auth(),
            viewPath: this.viewPath,
            ...this.globalVariable(),
            PersianDate: this.PersianDate,
            req: this.req,
            can: this.Authorized,
            csrf_filed: this.csrfFiled
        }
    }

    csrfFiled() {
        return `<input type="hidden" name="_csrf" value="${this.req.csrfToken()}">`
    }

    PermissionIsArray(permissions) {
        if (this.req.isAuthenticated()) {
            if (Array.isArray(permissions)) {
                permissions.forEach(permission => {
                    return this.req.userCan(permission);
                })
            }
        }
    }

    Authorized(permission) {
        this.PermissionIsArray(permission)
        if (this.req.isAuthenticated()) {
            return this.req.userCan(permission);
        }

    }

    viewPath(dir) {
        return path.resolve(config.layout.view_dir + '/' + dir)
    }

    auth() {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user,
        }
    }

    globalVariable() {
        return {
            errors: this.invalidData,
            old: this.old,
        }
    }

    invalidData(input) {
        for (let i = 0; i < this.errorsData.length; i++) {
            if (this.errorsData[i].param === input) {
                return this.errorsData[i].msg
            }
        }
    }

    old(data, defaultValue = null) {
        return this.FormData && this.FormData[data] ? this.FormData[data] : defaultValue
    }

    PersianDate(date) {
        return momentJalaali(date)
    }
}