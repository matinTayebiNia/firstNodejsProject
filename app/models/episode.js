const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const Bcrypt = require('bcrypt')


const episode = Schema({
    course: {type: Schema.Types.ObjectId, ref: 'Course'},
    title: {type: String, unique: true, required: true},
    type: {type: String, required: true},
    body: {type: String, required: true},
    time: {type: String, default: '00:00:00'},
    videoUrl: {type: String, required: true},
    number: {type: Number, required: true},
    viewCount: {type: Number, default: 0},
    downloadCount: {type: Number, default: 0},
    CommentCount: {type: Number, default: 0},
}, {timestamps: true, toJSON: {virtuals: true}})

episode.plugin(mongoosePaginate);

episode.methods.typeToPersian = function () {
    switch (this.type) {
        case 'cash':
            return '<sapn class="badge badge-primary ">نقدی</sapn>';
        case 'vip':
            return '<span class="badge badge-danger" >عضویت ویژه</span>'
        case 'free':
            return '<span class="badge badge-light" > رایگان</span>'
    }
}

episode.methods.incr = async function (column, increment = 1) {
    this[column] += increment
    await this.save()
}

episode.methods.decr = async function (column, increment = 1) {
    this[column] -= increment
    await this.save()
}

episode.methods.download = function (check, user) {
    if (!check) return '#';

    let status = false;
    if (this.type === 'free') status = true;
    else if (this.type === 'vip') {
        status = user.isVip(this.course._id);
    } else if (this.type === "cash") {
        status = user.checkLearning(this.course._id);
    }

    let timestamps = new Date().getTime() + 900 * 1000;
    let text = process.env.SECRET_KEY_URL + this.id + timestamps
    let salt = Bcrypt.genSaltSync(15);
    let hash = Bcrypt.hashSync(text, salt);
    return status ? `/episode/${this.id}?mac=${hash}&t=${timestamps}` : '#';
}
episode.methods.path = function () {
    return `${this.course.path()}/episode/${this.number}`
}

episode.virtual('comment', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'episode',
})

module.exports = mongoose.model('Episode', episode);