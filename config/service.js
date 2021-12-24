module.exports = {
    recaptcha: {
        site_key: process.env.RECAPTCH_SITE_KEY,
        secret_key: process.env.RECAPTCH_SECRET_KEY,
        option: {'hl': 'fa'},
    },
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_SECRET_ID,
        callback_url: process.env.GOOGLE_CALLBACK_URL
    }
}