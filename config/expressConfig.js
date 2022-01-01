const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override')
const csrfMiddleware = require("app/http/middleware/csrfMiddleware")
const csrfHandlerError = require('app/http/middleware/CerfHandlerError');
module.exports = {
    setupExpress: () => {
        const server = http.createServer(app);
        server.listen(config.port || 3000, () => console.log(`Listening on port ${config.port}`));
        const io = require("socket.io")(server)
        config.configSocketIo(io)
    },
    setConfig: () => {
        //set view
        config.layout.setEjsLayout(app);
        //use body parser package
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        //use express validator
        app.use(validator());
        //use session and set config for session
        app.use(session({...config.session}));
        //use cookieParser and set secretKey for cookie
        app.use(cookieParser(config.secret_cookie));
        //use connect-flash
        app.use(flash());
        // use methodOverride for use delete and put methods
        app.use(methodOverride('_method'))


        config.passportConfig(app)
    },
    /**use all routes app
     *
     *
     * */
    setRoutes: () => {

        app.use(require('app/routes/api/index'))
        app.use(csrfMiddleware.handel, require('app/routes/web/index'))
        app.use(require('app/routes/ErrorHandler'))
        app.use(csrfHandlerError.handel)

    },




}