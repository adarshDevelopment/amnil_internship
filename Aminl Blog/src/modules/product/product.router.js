const productController = require("./product.controller");
const fileUploader = require("../../middlewares/fileUploader.middleware");
const auth = require("../../middlewares/auth.middleware");
const router = require("express").Router();
const requestValidator = require("../../middlewares/requestValidator.middleware");
const { CreateProductDTO, UpdateProductDTO } = require("./product.validator");

router.route("/").get(productController.listAllProducts).post(
  auth(),

  fileUploader.single("image"),
  requestValidator(CreateProductDTO),
  productController.store
);

router
  .route("/:id")
  .put(
    auth(),
    fileUploader.single("image"),
    requestValidator(UpdateProductDTO),
    productController.update
  )
  .get(productController.show)
  .delete(auth(), productController.destroy);

module.exports = router;
