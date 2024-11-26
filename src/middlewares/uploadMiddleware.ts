import multer from "multer";
import path from "path";
import fs from "fs";

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(
      __dirname,
      "../../face/webcam_face_recognition/faces"
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create all parent directories if they don't exist
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 }, // 1MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Images Only!"));
  }
}

export default upload;
