const BaseService = require("../../services/base.service");
const ProductModel = require("./product.model");
const CloudinaryService = require("../../services/cloudinary.service");
const cloudinaryService = require("../../services/cloudinary.service");

class ProductService extends BaseService {
  constructor(model) {
    super(model);
  }

  transformProductCreate = async (req) => {
    const data = req.body;

    if (req.file) {
      const image = await cloudinaryService.uploadFile(
        req.file.path,
        "/products/"
      );
      data["image"] = image;
    }
    data["user"] = req.loggedInUserId;
    return data;
  };

  transformProductUpdate = async (req) => {
    // check if product exists,
    const _id = req.params.id;
    const data = req.body;

    const product = await this.fetchSingleRowByFilter({ _id });
    if (!product) {
      throw {
        message: "Product not found",
        status: "PRODUCT_NOT_FOUND",
        code: 404,
      };
    }

    // check if the user and the product's user is the same=
    const user = req.loggedInUser;

    console.log("product: ", product);
    const isAdmin = user.UserType === "admin";
    const isUser = product.user.toString() === user._id.toString();
    if (!(isAdmin || isUser)) {
      throw {
        message: "You cannot make changes to this product",
        status: "Unauthorized",
        code: 401,
      };
    }

    // attach user
    data["user"] = user._id;

    // if req has file, delete the old one and upload new picture
    if (req.file) {
      if (product.image?.public_id) {
        const response = await cloudinaryService.deleteFile(
          product.image.public_id
        );
      }

      const image = await cloudinaryService.uploadFile(
        req.file.path,
        "/products/"
      );
      data["image"] = image;
    } 
    
    // else {
    //   // if req does not have file attached to it, attach the old image to data and return data
    //   data["image"] = product.image;
    // }

    // return dats
    return data;
  };

  listAllProducts = async (query, filter) => {
    // pagination
    const page = +query.page || 1;
    const limit = +query.limit || 5;
    const skip = (page - 1) * limit;

    const sortBy = query.sort === "desc" ? -1 : query.sort === "asc" ? 1 : 1;

    const [data, totalCount] = await Promise.all([
      this.model.find(filter).limit(limit).skip(skip).sort({ price: sortBy }),
      this.model.countDocuments(filter),
    ]);

    const imageObj = data.map((d) => {
      const obj = d.toObject();
      return { ...obj, image: obj.image?.secure_url };
    });

    return {
      // data: data.map(item=>{return {...item,image:item.image.secure_url}}),
      data: imageObj,
      pagination: {
        page: page,
        limit: limit,
        skip: skip,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  };
}

module.exports = new ProductService(ProductModel);
