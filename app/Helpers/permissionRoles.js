const Permission = require('app/models/permission')

class PermissionRoles {

    async permission() {
        return await Permission.find({}).populate('roles').exec()
    }

    setPermission(gate) {
        this.permission().then(permissions => {
            permissions.forEach(permission => {
                let roles = permission.roles.map(role => role._id)
                gate.use(permission.name, (req) => {
                    return (req.isAuthenticated())
                        ? req.user.hasRoles(roles) : false;
                })
            })
        })
    }
}


module.exports = new PermissionRoles();