const ConnectRoles = require('connect-roles');
const permission = require('app/Helpers/permissionRoles')
const gate = new ConnectRoles({
    failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        const accept = req.headers.accept || '';
        res.locals.layout = "errors/master"
        res.status(403);
        if (~accept.indexOf('html')) {
            res.render('errors/403', {message: "!شما به این صفحه دسترسی ندارید", action});
        } else {
            res.json('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

permission.setPermission(gate)

module.exports = gate;
