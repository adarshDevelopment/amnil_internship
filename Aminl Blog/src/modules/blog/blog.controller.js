const { current } = require("@reduxjs/toolkit");
const commentService = require("../comment/comment.service");
const blogService = require("./blog.service");
const { UserType } = require("../../util/constants");

class BlogController {
  store = async (req, res, next) => {
    try {
      const data = await blogService.transformBlogCreate(req);
      const blog = await blogService.createSingleRow(data);
      res.status(201).json({
        data: blog,
        message: "Blog successfully created",
        status: "Success",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  index = async (req, res, next) => {
    try {
      // initialize an empty filter object
      let filter = {};
      // put search keyowrd in the filter object if there is a search in query params
      const search = req.query.search;
      if (search) {
        filter = {
          $or: [
            { title: RegExp(search, "i") },
            { subtitle: RegExp(search, "i") },
            { body: RegExp(search, "i") },
          ],
        };
      }
      /*
        filter would look like this
          filter = {$or:[{title:....}], isActive: true}
      */

      //  fetch required data from the service function
      const { data, pagination } = await blogService.listAllBlogs(
        filter,
        req.query
      );

      res.status(200).json({
        message: "Blogs successfully fetched",
        status: "Success",
        data,
        options: { pagination },
      });
    } catch (exception) {
      next(exception);
    }
  };

  verifyBlog = async (slug) => {
    try {
      const data = await blogService.model
        .findOne({ slug: slug })
        .populate("user", ["_id", "email", "name", "userType"])
        .populate("tag", ["_id", "title"]);
      if (!data) {
        throw {
          // display message saying the model name does not exist
          message: `${this.model.modelName} not found`,
          code: 404,
        };
      }
      return data;
    } catch (exception) {
      throw exception;
    }
  };

  update = async (req, res, next) => {
    try {
      // extracting id
      const slug = req.params.slug;

      // service method to fetch blog or throw exception
      const blog = await this.verifyBlog(slug);

      // verifying if the entered tag is valid and if the user matches the createdUser
      const data = await blogService.transformBlogUpdate(req, blog);

      // update blog
      const updatedBlog = await blogService.updateSingleRowByFilter(
        { _id: blog._id },
        data
      );

      res.status(201).json({
        message: "Blog successfully updated",
        status: "Success",
        data: updatedBlog,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  show = async (req, res, next) => {
    try {
      const slug = req.params.slug;
      const blog = await this.verifyBlog(slug);

      res.status(200).json({
        message: "Blog successfully fetched",
        options: null,
        status: "Success",
        data: blog,
      });
    } catch (exception) {
      next(exception);
    }
  };

  destroy = async (req, res, next) => {
    try {
      const slug = req.params.slug;
      // fetch selected blog
      const blog = await this.verifyBlog(slug);

      // check if the blog was created by the logged In User
      // or if the user is admin
      const isOwner = blog.user._id.toString() === req.loggedInUserId ;
      const isAdmin = req.loggedInUser.userType === UserType.admin;
      console.log('blog: ', blog);
      if(!(isOwner || isAdmin)){
       throw {
          message: "Unauthorized. You cannot delete this blog",
          code: 401,
        };
      }
      // call the delete function on the blog instance
      await blog.deleteOne();
      res.status(201).json({
        message: "Blog successfully deleted",
        status: "Success",
        data: null,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  listAllComments = async (req, res, next) => {
    try {
      const _id = req.params.id;
      // fetch comments whos blog is equal to the entered blog
      const { data, pagination } = await commentService.listAllComments({
        blog: _id,
      });
      res.status(200).json({
        message: "Comments fetched for the entered blog",
        status: "Success",
        data: data,
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  fetchByUser = async () => {
    try {
      const userId = req.params.user;
      const blogs = await blogService.fetchMultipleRowsByFilter({
        user: userId,
      });
      res.json({
        message: "Blogs fetched succesfully by user",
        status: "success",
        data: blogs,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  fetchYourBlogs = async () => {
    try {
      console.log("in here");
      const yourBlogs = await blogService.fetchMultipleRowsByFilter({
        user: req.loggedInUserId,
      });
      console.log("yourBLogs: ", yourBlogs);
      res.json({
        message: "Your blogs successfully fetched",
        status: "success",
        data: yourBlogs,
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

module.exports = new BlogController();
