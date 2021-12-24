const Agenda = require('agenda')


const jobQueue = new Agenda({
    db: {
        address: env("DB_HOST"),
        collection: "jobs",
    },
});

jobQueue.on('start', job => {
    console.log('Job %s starting', job.attrs.name);
});

jobQueue.on('complete', job => {
    console.log(`Job ${job.attrs.name} finished`);
});


module.exports = jobQueue