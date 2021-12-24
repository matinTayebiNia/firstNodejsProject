const dayJs = require("dayjs")

const JobQueue = config.queueConfig

let transporter = config.mailer.transporter


JobQueue.define(
    "send email verification",
    {priority: "high", concurrency: 10},
    async (job) => {
        const {token, subject, to} = job?.attrs?.data;
        await transporter.sendMail({
            to,
            from: '"مجله آموزشی 👻" <supprot@nodejsCourse.com>',
            subject, // Subject line
            html: `
            <p>برای تایید ایمیل خود بر روی لینک زیر کلیک کنید</p>
            <br>
            <a href="${config.AppUrl}/user/verify/${token}">لینک</a>`,
        });
    }
);


module.exports = async (data, subject) => {
    await JobQueue.start()
    await JobQueue.schedule(dayJs().add(5, "seconds").format(),
        "send email verification", {
            to: data.email,
            token: data.token,
            subject
        });
}