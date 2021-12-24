const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = Schema({
    parent: {type: Schema.Types.ObjectId, ref: 'Category', default: null},
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
}, { timestamps: true, toJSON: {virtuals: true}})

CategorySchema.plugin(mongoosePaginate);

CategorySchema.virtual('courses',{
    ref:"Course",
    localField: '_id',
    foreignField: 'categories',
})

CategorySchema.virtual('chileCategory', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent',
})

module.exports = mongoose.model('Category', CategorySchema);