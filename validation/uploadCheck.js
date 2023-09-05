const util = require('util');
const multer = require('multer');

const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
      cb(null, true);
    } else {
      cb("Please upload only csv file.", false);
    }
  };

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storage/csv');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var uploadFile = multer({ storage: storage, fileFilter: csvFilter }).single('file');

const uploadFilesMiddleware = util.promisify(uploadFile);

module.exports = uploadFilesMiddleware;