const autoBind = require('auto-bind');

class Request {
    constructor() {
        autoBind(this);
    }
}

module.exports = Request;