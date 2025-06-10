import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Para __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
   filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });