const joi = require("joi");

const CreateBlogDto = joi.object({
  title: joi.string().min(2).max(150).required(),
  subtitle: joi.string().allow(null, ""),
  body: joi.string().min(10).required(),
  tag: joi.string().required(),
});

const UpdateBlogDTO = joi.object({
  title: joi.string().min(2).max(150).required(),
  subtitle: joi.string().allow(null, ""),
  body: joi.string().min(10).required(),
  tag: joi.string().required(),
});

module.exports = {
  CreateBlogDto,
  UpdateBlogDTO,
};
