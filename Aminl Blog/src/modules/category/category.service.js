const BaseClass = require("../../services/base.service");
const categoryModel = require("./category.model");

class CategoryService extends BaseClass {
  transformCreateCategory = async (req) => {
    try {
      const data = req.body;
      const category = await this.fetchSingleRowByFilter({ title: data.title });
      if (category) {
        throw {
          message: "Entered category already exists.",
          code: 422,
        };
      }
      return data;
    } catch (exception) {
      throw exception;
    }
  };
}

module.exports = new CategoryService(categoryModel);
