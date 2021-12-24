const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const dayJs = require("dayjs")
const uniqueString = require("unique-string")
const sendEmailVerification = require("app/Helpers/sendEmailVerifacation")

const activationCode = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    code: {type: String, required: true},
    use: {type: Boolean, default: false},
    expire: {type: Date, required: true}
}, {timestamps: true});

activationCode.methods.userHasActivationCode = async function (user) {
    if (!user.active) {
        let activeCode = await mongoose.model('ActivationCode').find({user: user.id}).gt("expire", new Date())
            .sort({createdAt: 1}).populate([{path: "user"}]).limit(1).exec()
        if (activeCode.length) {
            activeCode.forEach(item => {
                sendEmailVerification({email: item.user.email, token: item.code}, "تایید ایمیل");
            })
            return;
        } else {
            let code = uniqueString()
            let newActiveCode = new mongoose.model('ActivationCode')({
                user: user.id,
                code,
                use: false,
                expire: dayJs().add(10, "minutes").format(),
            })
            await newActiveCode.save();
            await sendEmailVerification({email: user.email, token: newActiveCode.code}, "تایید ایمیل")
            return;
        }
    }
    return true;
}
module.exports = mongoose.model('ActivationCode', activationCode);