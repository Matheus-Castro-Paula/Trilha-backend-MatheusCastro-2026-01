const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

/**
 * Middleware responsável pelo upload de imagens utilizando
 * Multer integrado ao Cloudinary.
 * Define os formatos permitidos e a pasta de armazenamento.
 * Valida o tipo de arquivo para garantir que apenas imagens sejam aceitas.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "API_produtos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Apenas arquivos de imagem (JPEG, PNG, WEBP) são permitidos."),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const uploadImage = (req, res, next) => {
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    next();
  });
};

module.exports = uploadImage;
