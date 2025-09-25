const categoryService = require("./category.service");

class CategoryController {
  index = async (req, res, next) => {
    try {
      const categories = await categoryService.fetchMultipleRowsByFilter();
      res.json({
        message: "Categories successfully fetched",
        stats: "Success",
        data: categories,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  store = async (req, res, next) => {
    try {
      const data = await categoryService.transformCreateCategory(req);
      const response = await categoryService.createSingleRow(data);
      res.json({
        message: "Category successfully created",
        status: "SUCCESS",
        data: response,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  update = async (req, res, next) => {
    try {
      const _id = req.params.id;
      const data = req.body;
      const category = await categoryService.verifyData(_id);

      const updatedCategory = await categoryService.updateSingleRowByFilter(
        { _id: _id },
        data
      );
      res.json({
        message: "Category successfully updated",
        status: "Success",
        data: updatedCategory,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  show = async (req, res, next) => {
    try {
      const _id = req.params.id;
      const category = await categoryService.verifyData(_id);
      res.json({
        message: "Category successfully fetched",
        status: "Success",
        data: category,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  destroy = async (req, res, next) => {
    try {
      const _id = req.params.id;
      const category = await categoryService.verifyData(_id);
      const deletedRecord = await categoryService.deleteSingleRowByFilter({
        _id,
      });

      res.json({
        message: "Category successfully deleted",
        status: "Success",
        data: deletedRecord,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

module.exports = new CategoryController();
