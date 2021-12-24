const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CommentSchema = Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    course: {type: Schema.Types.ObjectId, ref: 'Course', default: undefined},
    episode: {type: Schema.Types.ObjectId, ref: 'Episode', default: undefined},
    parent: {type: Schema.Types.ObjectId, ref: 'Comment', default: null},
    approved: {type: Boolean, required: true, default: false},
    comment: {type: String, required: true},
}, {timestamps: true, toJSON: {virtuals: true}})

CommentSchema.plugin(mongoosePaginate);
const CommentBelong = doc => {
    if (doc.course) {
        return 'Course';
    } else if (doc.episode) {
        return 'Episode'
    }
}
CommentSchema.virtual('parentComment', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parent',
})
CommentSchema.virtual('belongTo', {
    ref: CommentBelong,
    localField: doc => CommentBelong(doc).toLowerCase(),
    foreignField: '_id',
    justOne: true,
})


CommentSchema.methods.getSubjectTitles = function () {
    if (this.course) {
        return {url: this.course.path(), subject: this.course};
    } else if (this.episode) {
        return {url: this.episode.path(), subject: this.episode};
    }
}

CommentSchema.methods.IsApproved = function () {
    switch (this.approved) {
        case false:
            return '<span class="badge badge-danger"> تایید نشده </span>';
        case true:
            return '<span class="badge badge-success"> تایید شده </span>'

    }
}

module.exports = mongoose.model('Comment', CommentSchema);