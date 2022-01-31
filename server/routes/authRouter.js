const {Router} = require('express');
const router = Router();
const authController = require('../controllers/authController');
const {loginValidator} = require('../middleware/validator');




router.get('/login', authController.getLoginPage);


router.post('/login', loginValidator, authController.login);


router.get('/register', authController.getRegisterPage);


router.post('/register', authController.register);


router.get('/logout', authController.logout);


router.get('/reset', authController.getResetPage);


router.post('/reset', authController.reset);


router.get('/password/:token', authController.getPasswordPage);


router.post('/password', authController.newPassword);



//router.post('/login', authController.login);




module.exports = router;