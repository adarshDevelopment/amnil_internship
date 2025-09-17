const router = require("express").Router();
const blogController = require("./blog.controller");
const auth = require("../../middlewares/auth.middleware");
const { CreateBlogDto, UpdateBlogDTO } = require("./blog.validator");
const requestValidator = require("../../middlewares/requestValidator.middleware");

router
  .route("/")
  .get(blogController.index)
  .post(
    auth(["user", "admin"]),
    requestValidator(CreateBlogDto),
    blogController.store
  );
router
  .route("/:slug")
  .get(blogController.show)
  .put(
    auth(["user", "admin"]),
    requestValidator(UpdateBlogDTO),
    blogController.update
  )
  .delete(auth(["user", "admin"]), blogController.destroy);
router.get("/list-comments/:id", blogController.listAllComments);

router.get("/:user", blogController.fetchByUser);
module.exports = router;
