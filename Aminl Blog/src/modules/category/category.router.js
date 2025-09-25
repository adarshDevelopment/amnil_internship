const router = require("express").Router();
const categoryController = require("./category.controller");
const auth = require("../../middlewares/auth.middleware");
const {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} = require("./category.validator");
const requestValidator = require("../../middlewares/requestValidator.middleware");

router
  .route("/")
  .get(categoryController.index)
  .post(auth('admin'), requestValidator(CreateCategoryDTO), categoryController.store);
  // .post(auth('admin'), requestValidator(CreateCategoryDTO), categoryController.store);
router
  .route("/:id")
  .get(categoryController.show)
  .put(auth('admin'),requestValidator(UpdateCategoryDTO), categoryController.update)
  .delete(categoryController.destroy);

module.exports = router;
