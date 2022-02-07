const {Router} = require('express');
const router = Router();
const authController = require('../controllers/authController');
const {loginValidator} = require('../middleware/validator');
const {registerValidator} = require('../middleware/validator');
const {passwordValidator} = require('../middleware/validator');




router.get('/login', authController.getLoginPage);


router.post('/login', loginValidator, authController.login);


router.get('/register', authController.getRegisterPage);


router.post('/register', registerValidator, authController.register);


router.get('/logout', authController.logout);


router.get('/reset', authController.getResetPage);


router.post('/reset', authController.reset);


router.get('/password/:token', authController.getPasswordPage);


router.post('/password', passwordValidator, authController.newPassword);








module.exports = router;