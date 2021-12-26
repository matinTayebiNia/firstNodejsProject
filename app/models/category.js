const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CategorySchema = Schema({
    parent: {type: Schema.Types.ObjectId, ref: 'Category', default: null},
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
}, { timestamps: true, toJSON: {virtuals: true}})


CategorySchema.virtual('courses',{
    ref:"Course",
    localField: '_id',
    foreignField: 'categories',
})


module.exports = mongoose.model('Category', CategorySchema);