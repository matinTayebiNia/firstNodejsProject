class SweetAlertBuilder {
    constructor(req) {
        this.req = req;
        this.buider = {}
    }

    setIcon(icon) {
        this.buider.icon = icon;
        return this;
    }

    setButton(button) {
        this.buider.button = button;
        return this;
    }

    setTitle(title) {
        this.buider.title = title
        return this;
    }

    setMessage(message) {
        this.buider.message = message;
        return this;
    }

    setTimer(time = 2000) {
        this.buider.timer = time
        return this;
    }

    makeToast() {
        this.buider.toast = true
        return this;
    }

    build() {
        if (this.buider.button === undefined) {
            this.setTimer()
            return this.req.flash("sweetAlert", this.buider)
        } else {
            this.setButton("باشه")
            return this.req.flash("sweetAlert", this.buider)
        }
    }
}

module.exports = SweetAlertBuilder;