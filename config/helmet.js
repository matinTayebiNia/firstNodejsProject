const helmet = require('helmet')

module.exports = (app) => {
    app.enable("trust proxy")
    app.use(helmet());
}
