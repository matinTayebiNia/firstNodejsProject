const database = require('./database');
const layout = require('./layout');
const session = require('./session');
const connection = require('./connection')
const service = require('./service')
const expressConfig = require('./expressConfig')
const passportConfig = require('./passportConfig')
const mailer = require('./mailer')
const helmet = require('./helmet')
const cors = require("./cors")
const apiLimiter = require("./apiLimiter")
const queueConfig = require("./queueConfig")
const configSocketIo=require("./configSocketIo")
module.exports = {
    apiLimiter,
    cors,
    helmet,
    database,
    port: env('PORT'),
    secret_cookie: env('COOKIE_SECRET_KEY'),
    layout,
    debug: true,
    payping_tokene: env('PAYPING_TOKEN'),
    session,
    connection,
    service,
    expressConfig,
    passportConfig,
    AppUrl: env("APP_URL"),
    secretKayJwt: env("SECRET_KEY_JWT"),
    mailer,
    queueConfig,
    configSocketIo
}