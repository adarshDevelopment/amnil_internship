const Joi = require("joi");

const CreateCategoryDTO = Joi.object({
  title: Joi.string().min(2),
});

const UpdateCategoryDTO = Joi.object({
  title: Joi.string().min(2),
});

module.exports = {
  CreateCategoryDTO,
  UpdateCategoryDTO,
};
