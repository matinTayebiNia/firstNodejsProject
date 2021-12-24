module.exports = {
    corsOption: {
        origin: (origin, callback) => {
            // Here you put the hosts you are considering as a representation inside this variable
            const whitelist = ['http://localhost:3000'];

            if (whitelist.indexOf('*') !== -1) {
                return callback(null, true)
            }
            if (whitelist.includes(origin) !== -1) {
                return callback(null, true)
            } else {
                return callback(new Error('Not allowed by CORS'))
            }
        },
        optionsSuccessStatus: 200
    }
}