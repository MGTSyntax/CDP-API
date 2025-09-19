// /middleware/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const department = req.query.department || req.body.department || "general";
        const uploadPath = path.join(__dirname, '../uploads', department);

        // Always ensure the folder exists
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) return cb(err, uploadPath);
            cb(null, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 30 * 1024 * 1024 }
});

module.exports = upload;