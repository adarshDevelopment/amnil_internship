const router = require("express").Router();
const authController = require("./auth.controller");
const requestValidator = require('../../middlewares/requestValidator.middleware');
const {LoginDTO, RegisterDTO} = require('./auth.validator');
const auth = require("../../middlewares/auth.middleware");

router.post("/register", requestValidator(RegisterDTO), authController.register);
router.post("/login", requestValidator(LoginDTO), authController.login);
router.get("/me", auth(['admin', 'user']), authController.showOwnProfile)
router.get('/:userId/blogs', authController.getProfileBlogs );
router.put('/updateOwnProfile', auth(), authController.updateOwnProfile);

router.post('/forgetPassword', authController.forgetPassword);
router.put('/resetPassword/:token', authController.resetPassword);
router.get('/authenticateResetToken/:token', authController.authenticateResetToken);
module.exports = router;
