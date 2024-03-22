import multer from "multer";

const fileStorage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: fileStorage,
  fileFilter(_req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return callback(new Error("Please upload an image"));
    }
    callback(null, true);
  },
});
