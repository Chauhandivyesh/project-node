const multer = require("multer");
const path = require("path");
const { statusCode } = require("../global");
const { OK: success, BAD_REQUEST: badRequest, INTERNAL_SERVER_ERROR: internalError } = statusCode;

// Define Multer storage and limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const maxSize = 1 * 1000 * 1000; // 1MB

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
}).any(); // Use .any() to accept files from any field name

const uploadImageProduct = {
  // Handle the file upload
  async uploadImage(req, res) {
    try {
      upload(req, res, (err) => {
        if (err) {
          return res.status(badRequest.statuscode).json({
            badRequest,
            err,
          });
        }
        const files = req.files;
        if (files && files.length > 0) {
          return res.status(success.statuscode).json({
            success,
            files,
          });
        }
        return res.send("No file was uploaded");
      });
    } catch (err) {
      return res.status(internalError.statuscode).json({
        internalError,
        err,
      });
    }
  },
};

module.exports = uploadImageProduct;
