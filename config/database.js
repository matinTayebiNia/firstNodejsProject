module.exports = {
    url: process.env.DB_HOST,
    option: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        useCreateIndex:true

    }
}