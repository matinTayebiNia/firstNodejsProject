const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const course = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, unique: true, required: true},
    categories:[{type: Schema.Types.ObjectId, ref: 'Category'}],
    slug: {type: String, required: true},
    type: {type: String, required: true},
    body: {type: String, required: true},
    price: {type: String, required: true},
    thumb: {type: String, required: true},
    images: {type: Object},
    tags: {type: String, required: true},
    time: {type: String, default: '00:00:00'},
    viewCount: {type: Number, default: 0},
    CommentCount: {type: Number, default: 0},
}, {timestamps: true, toJSON: {virtuals: true}})

course.plugin(mongoosePaginate);

course.methods.typeToPersian = function () {
    switch (this.type) {
        case 'cash':
            return '<sapn class="badge badge-primary ">نقدی</sapn>';
        case 'vip':
            return '<span class="badge badge-danger" >عضویت ویژه</span>'
        case 'free':
            return '<span class="badge badge-light" > رایگان</span>'
    }
}


course.methods.path = function () {
    return `/courses/${this.slug}`
}
course.methods.incr = async function (column, increment = 1) {
    this[column] += increment
    await this.save()
}

course.methods.decr = async function (column, increment = 1) {
    this[column] -= increment
    await this.save()
}
course.virtual('episodes', {
    ref: 'Episode',
    localField: '_id',
    foreignField: 'course'
})
course.virtual('comment', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'course',
})

module.exports = mongoose.model('Course', course);