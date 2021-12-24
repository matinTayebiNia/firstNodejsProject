const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const OrderSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    course: {type: Schema.Types.ObjectId, ref: "Course", default: null},
    vip: {type: Boolean, default: false},
    clientRefId: {type: String, required: true},
    amount: {type: Number, required: true},
    payment: {type: Boolean, default: false},
}, {timestamps: true, toJSON: {virtuals: true}});

OrderSchema.plugin(mongoosePaginate);

OrderSchema.methods.StatusPayment = function () {
    return this.payment === false ? '<span class="badge badge-danger">نا موفق</span>' :
        '<span class="badge badge-success">موفق</span>';
}

module.exports = mongoose.model('Order', OrderSchema);