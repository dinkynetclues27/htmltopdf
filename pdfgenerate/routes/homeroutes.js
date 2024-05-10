const express = require ('express')
const {homeview,generatepdf} = require('../controllers/homecontroller');

const router = express.Router();
router.get('/',homeview);
router.get('/download',generatepdf)
module.exports={
    routes:router
}
