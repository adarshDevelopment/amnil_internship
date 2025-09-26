const cloudinaryService = require("../../services/cloudinary.service");
const productService = require("./product.service");

class ProductController {
  listAllProducts = async (req, res, next) => {
    try {
      let filter = {};

      const { search, category, minPrice, maxPrice } = req.query;

      if (search) {
        filter["title"] = { $regex: search, $options: "i" };
      }

      if (category) {
        filter["category"] = category;
      }

      if (maxPrice || minPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = +minPrice;
        if (maxPrice) filter.price.$lte = +maxPrice;
      }
      const { data, pagination } = await productService.listAllProducts(
        req.query,
        filter
      );
      // console.log('data: ', data);
      res.json({
        message: "Products successfully fetched",
        status: "Success",
        data,
        options: { pagination },
      });
    } catch (exception) {
      next(exception);
    }
  };

  store = async (req, res, next) => {
    try {
      const data = await productService.transformProductCreate(req);
      const product = await productService.createSingleRow(data);
      console.log("product: ", product);
      res.json({
        message: "Product successfully created",
        status: "Success",
        data: product,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  update = async (req, res, next) => {
    try {

      const data = await productService.transformProductUpdate(req);
      // res.json(data);
      console.log('data: ', data);
      const _id = req.params.id;
      const product = await productService.updateSingleRowByFilter(
        { _id },
        data
      );

      res.json({
        message: "Product successfully updated",
        status: "Success",
        data: product,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  destroy = async (req, res, next) => {
    try {
      const _id = req.params.id;
      const product = await productService.verifyData(_id);
      console.log("product in product Controller: ", product);
      const isAdmin = req.loggedInUser.userType == "admin";
      const isUser = product.user.toString() === req.loggedInUserId.toString();
      if (!(isAdmin || isUser)) {
        throw {
          message: "You cannot make changes to this product",
          status: "Unauthorized",
          code: 401,
        };
      }
      if (product.image.public_id) {
        await cloudinaryService.deleteFile(product.image.public_id);
      }
      const deletedProduct = await productService.deleteSingleRowByFilter({
        _id,
      });
      res.json({
        message: "Product successfully deleted",
        status: "Success",
        data: deletedProduct,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  show = async (req, res, next) => {
    try {
      const _id = req.params.id;
      const product = await productService.model
        .findOne({ _id })
        .populate(["category", "user"]);
      if (!product) {
        throw {
          message: "Product not found",
          status: "NOT FOUND",
          code: 404,
        };
      }
      // const product = await productService.verifyData(_id);
      res.json({
        message: "Product successfully fetched",
        stauts: "Success",
        data: {
          ...product.toObject(),
          image: product.image.secure_url,
          user: {
            name: product.user.name,
            email: product.user.email,
            image: product.user.image.secure_url,
          },
        },
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

module.exports = new ProductController();
