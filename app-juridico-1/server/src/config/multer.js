const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const empId = String(req.params.id || 'general');
    const dest = path.join(UPLOAD_DIR, empId);
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = String(file.originalname || 'file').replace(/[^a-z0-9.\-_]/gi, '_').toLowerCase();
    cb(null, `${ts}-${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Tipo de arquivo não permitido (use PDF/JPG/PNG)'));
    cb(null, true);
  }
});

module.exports = upload;