const autoBind = require('auto-bind');

class middleware {
    constructor() {
        autoBind(this);
    }
}

module.exports = middleware;