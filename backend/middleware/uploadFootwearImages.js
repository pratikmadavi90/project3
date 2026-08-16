const multer = require("multer");
const multerS3 = require("multer-s3");

const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "harzo-images-storage",

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      const fileName =
        `footwear/${Date.now()}-${file.originalname
          .toLowerCase()
          .replace(/\s+/g, "-")}`;

      cb(null, fileName);
    },
  }),
});

module.exports = upload;