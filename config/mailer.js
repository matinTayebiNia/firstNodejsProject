const nodeMailer = require("nodemailer")

module.exports = {
    transporter: nodeMailer.createTransport({
        host: env("HOST_MAIL"),
        port: env("PORT_MAIL"),
        secure: false, // true for 465, false for other ports
        auth: {
            user: env("USERNAME_MAIL"), // generated ethereal user
            pass: env("PASSWORD_MAIL"), // generated ethereal password
        },
    })
}
