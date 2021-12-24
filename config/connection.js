const mongoose = require('mongoose');
module.exports = {
    setMongoConnection: () => {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url, {...config.database.option}).then();

    }
}
