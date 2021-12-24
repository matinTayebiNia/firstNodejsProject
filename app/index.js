module.exports = class Application {
    constructor() {
        config.expressConfig.setupExpress();
        config.connection.setMongoConnection();
        config.expressConfig.setConfig()
        config.expressConfig.setRoutes();
    }
}