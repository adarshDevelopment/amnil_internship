const cloudinary = require("cloudinary").v2;
const { CloudinaryConfig } = require("../config/config");
const { deleteFile } = require("../util/helper");
class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.cloudName,
      api_key: CloudinaryConfig.apiKey,
      api_secret: CloudinaryConfig.apiSecret,
    });
  }

  uploadFile = async (filePath, dir = "/") => {
    try {
      const { public_id, url, secure_url } = await cloudinary.uploader.upload(
        filePath,
        {
          unique_filename: true,
          folder: "/amnil-blog" + dir,
        }
      );

      deleteFile(filePath);
      return {
        public_id,
        url,
        secure_url,
      };
    } catch (exception) {
      throw {
        message: "Error uploading file on Cloudinary",
        status: "CLOUDINARY_FAILURE",
      };
    }
  };

  deleteFile = async (publicId) => {
    try {
      console.log('public ID: ', publicId)
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (exception) {
      console.log("cloudinary delet: ", exception);
      throw {
        message: "Error deleting picture in cloud",
        status: "PICTURE_DELETE_ERROR",
      };
    }
  };
}

module.exports = new CloudinaryService();
