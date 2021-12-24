module.exports = {
    //its Means 15 min
    windowMs: 900000,
    max: 100,
    message: "تعداد درخواست های داده شده پیش از حد مجاز",
    handler: function (req, res) {
        res.status(500).json({
            data:this.message,
            status: "error"
        });
    }
}