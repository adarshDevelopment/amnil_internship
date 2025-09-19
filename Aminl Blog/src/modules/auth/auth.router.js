const router = require("express").Router();
const authController = require("./auth.controller");
const requestValidator = require('../../middlewares/requestValidator.middleware');
const {LoginDTO, RegisterDTO} = require('./auth.validator');
const auth = require("../../middlewares/auth.middleware");
const fileUploader = require('../../middlewares/fileUploader.middleware')

router.post("/register", requestValidator(RegisterDTO), authController.register);
router.post("/login", requestValidator(LoginDTO), authController.login);
router.get("/me", auth(['admin', 'user']), authController.showOwnProfile)
router.get('/:userId/blogs', authController.getProfileBlogs );


router.post('/forgetPassword', authController.forgetPassword);
router.put('/resetPassword/:token', authController.resetPassword);
router.get('/authenticateResetToken/:token', authController.authenticateResetToken);

router.put('/updateOwnProfile', auth(), fileUploader.single('image'),   authController.updateOwnProfile);
router.get('/activate-user/:token', authController.activateUser);
router.post('/send-verification-email',auth(), authController.sendVerificationEmail);
module.exports = router;
