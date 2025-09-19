const cloudinary = require("cloudinary").v2;
const { CloudinaryConfig } = require("../config/config");
const {deleteFile} = require('../util/helper')
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
}

module.exports = new CloudinaryService();
