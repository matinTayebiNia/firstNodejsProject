require('app-module-path').addPath(__dirname)

const App = require('./app');
require('dotenv').config();
global.env = (environment) => {
    return process.env[environment]
}
global.config = require('./config')


new App();