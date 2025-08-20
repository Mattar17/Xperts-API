const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/png", "image/jpg", "image/jpeg"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("only .jbg .jpeg .png are accepted"));
  }
};
const upload = multer({
  storage,
  fileFilter,
  limit: { fileSize: 5 * 1024 * 1024 },
});

const uploadImage = async function (
  buffer,
  mimetype,
  folder = "Xperts/users_pictures"
) {
  try {
    const buffer64 = buffer.toString("base64");
    const dataURI = `data:${mimetype};base64,${buffer64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
    });
    return result.secure_url;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadImage,
  upload,
};
