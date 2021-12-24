const dayJs = require("dayjs")

const JobQueue = config.queueConfig

let transporter = config.mailer.transporter

JobQueue.define(
    "send email report",
    {priority: "high", concurrency: 10},
    async (job) => {
        const {to, token, subject} = job?.attrs?.data;
        await transporter.sendMail({
            to,
            from: '"مجله آموزشی 👻" <supprot@nodejsCourse.com>',
            subject, // Subject line
            html: `
            <h2>بازیابی رمز عبور</h2>
            <p>برای بازیابی رمز عبور روی لینک زیر کلیک کنید</p>
            <br>
            <a href="${config.AppUrl}/auth/password/reset/${token}">لینک</a>
         
            `,
        });
    }
);


module.exports = async (data, subject) => {
    await JobQueue.start()
    await JobQueue.schedule(dayJs().add(5, "seconds").format(),
        "send email report", {
            to: data.email,
            token: data.token,
            subject
        });
}

