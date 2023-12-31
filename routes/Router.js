const { Router } = require('express');
const practiceController=require('../controller/practiceController');
const { requireAuth, checkUser  } = require('../middleware/authMiddleware');
const router = Router();
router.post('/signup', practiceController.signup_post);
router.post('/login', practiceController.login_post);
router.get('/logout', requireAuth,practiceController.logout_get);
router.post('/add-Product',requireAuth,practiceController.addProduct_post);
router.get('/view-Product',requireAuth,practiceController.viewProduct_get);
module.exports = router;
