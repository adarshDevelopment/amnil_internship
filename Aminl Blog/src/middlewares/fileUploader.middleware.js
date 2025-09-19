const multer = require("multer");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = "./public/uploads";
    // if directory does not exist, create it
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
