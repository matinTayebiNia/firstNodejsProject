const mongoose = require('mongoose')
const Bcrypt = require('bcrypt')
const Schema = mongoose.Schema;
const uniqueString = require('unique-string');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = Schema({
    name: {type: String, required: true},
    active: {type: Date, default: null},
    admin: {type: Boolean, default: 0},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    rememberToken: {type: String, default: null,},
    VipType: {type: String, default: "month",},
    VipTime: {type: Date, default: new Date().toISOString(),},
    learning: [{type: Schema.Types.ObjectId, ref: 'Course'}],
    roles: [{type: Schema.Types.ObjectId, ref: 'Role'}]
}, {timestamps: true, toJSON: {virtuals: true}});

UserSchema.plugin(mongoosePaginate);

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();//با اضافه کردن این خط در صورتی که رمز عبور تغییر نکرده باشه کدهای بعدی اجرا نمیشه
    let salt = Bcrypt.genSaltSync(15);
    this.password = Bcrypt.hashSync(this.password, salt);
    next()
})


UserSchema.methods.setRememberToken = function (res) {
    const Token = uniqueString();
    res.cookie('remember_token', Token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        signed: true,
    })
    this.update({rememberToken: Token}, err => {
        if (err) console.error(err)
    })
}

UserSchema.methods.comparePassword = function (password) {
    return Bcrypt.compareSync(password, this.password);
}

UserSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'user'
})

UserSchema.methods.hasRoles = function (roles) {
    let result = roles.filter(role => {
        return this.roles.indexOf(role) > -1;
    })
    return !!result.length;
}

UserSchema.methods.isAdmin = function () {
    switch (this.admin) {
        case true:
            return '<span class="badge badge-primary">ادمین</span>'
        case false:
            return '<span class="badge badge-light" >کاربر معمولی</span>'
    }
}

UserSchema.methods.isVip = function (courseId = null) {
    return new Date(this.VipTime) > new Date() || this.learning.indexOf(courseId) !== -1;
}
UserSchema.methods.checkLearning = function (courseId) {
    return this.learning.indexOf(courseId) !== -1;
}

module.exports = mongoose.model('User', UserSchema);