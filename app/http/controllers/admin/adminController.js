const Controller = require('app/http/controllers/controller')

class adminController extends Controller {
    index(req, res) {
        res.render('admin/index')
    }

    uploadImage(req, res) {
        let image = req.file;

        res.json({
            "uploaded": 1,
            "fileName": image.originalname,
            "url": this.getUrlImage(image.destination + '/' + image.filename)
        })
    }
}

module.exports = new adminController();