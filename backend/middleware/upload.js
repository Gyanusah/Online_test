// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Create uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadPath = uploadsDir;

//     // Create subdirectories based on file type
//     if (file.fieldname === "audioFile") {
//       uploadPath = path.join(uploadsDir, "audio");
//     } else if (file.fieldname === "image") {
//       uploadPath = path.join(uploadsDir, "images");
//     } else if (file.fieldname === "profilePicture") {
//       uploadPath = path.join(uploadsDir, "profiles");
//     } else if (file.fieldname === "logo") {
//       uploadPath = path.join(uploadsDir, "logos");
//     } else if (file.fieldname === "courseMaterial") {
//       uploadPath = path.join(uploadsDir, "materials");
//     }

//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // Generate unique filename
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = {
//     audioFile: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"],
//     image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
//     profilePicture: ["image/jpeg", "image/jpg", "image/png"],
//     logo: ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
//     courseMaterial: ["application/pdf"],
//   };

//   const allowedMimes = allowedTypes[file.fieldname] || [];

//   if (allowedMimes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error(
//         `Invalid file type for ${file.fieldname}. Allowed types: ${allowedMimes.join(", ")}`,
//       ),
//       false,
//     );
//   }
// };

// // Multer configuration
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB max for uploaded files
//   },
// });

// // Single file upload
// const uploadSingle = (fieldName) => (req, res, next) => {
//   const uploadMiddleware = upload.single(fieldName);
//   uploadMiddleware(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ success: false, message: err.message });
//     } else if (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }
//     next();
//   });
// };

// // Multiple files upload
// const uploadMultiple = (fieldName, maxCount) => (req, res, next) => {
//   const uploadMiddleware = upload.array(fieldName, maxCount);
//   uploadMiddleware(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ success: false, message: err.message });
//     } else if (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }
//     next();
//   });
// };

// // Mixed fields upload
// const uploadFields = (fields) => (req, res, next) => {
//   const uploadMiddleware = upload.fields(fields);
//   uploadMiddleware(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ success: false, message: err.message });
//     } else if (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }
//     next();
//   });
// };

// module.exports = {
//   upload,
//   uploadSingle,
//   uploadMultiple,
//   uploadFields,
// };
