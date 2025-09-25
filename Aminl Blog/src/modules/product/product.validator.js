const Joi = require("joi");

const CreateProductDTO = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  price: Joi.number().min(100).max(5000000),
  stock: Joi.number().min(1).max(100),
  category: Joi.string().required(),
  description: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
});


const UpdateProductDTO = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  price: Joi.number().min(100).max(5000000),
  stock: Joi.number().min(1).max(100),
  category: Joi.string().required(),
  description: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
});

module.exports = {
  CreateProductDTO,UpdateProductDTO
}