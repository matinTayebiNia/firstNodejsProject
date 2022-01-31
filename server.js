require('app-module-path').addPath(__dirname)

require('dotenv').config();
global.env = (environment) => {
    return process.env[environment]
}
// noinspection JSValidateTypes
global.config = require('./config')


class Application {
    constructor() {
        config.expressConfig.setupExpress();
        config.connection.setMongoConnection();
        config.expressConfig.setConfig()
        config.expressConfig.setRoutes();
    }
}

new Application();