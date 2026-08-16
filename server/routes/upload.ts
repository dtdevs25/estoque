import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, requireAdminOrController } from '../middleware/auth.js';
import { uploadToS3, BUCKETS } from '../lib/s3.js';

export const uploadRouter = Router();
uploadRouter.use(authenticate, requireAdminOrController);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

// POST /api/upload/item
uploadRouter.post('/item', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) { res.status(400).json({ message: 'Arquivo não enviado.' }); return; }
    const { itemType } = req.body; // 'EPI', 'EPC', 'ERGONOMICO'
    const bucket = itemType === 'ERGONOMICO' ? BUCKETS.ergonomicos : BUCKETS.items;
    const key = `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;
    const url = await uploadToS3(bucket, key, req.file.buffer, req.file.mimetype);
    res.json({ url });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ message: 'Erro ao fazer upload da imagem.' });
  }
});

// POST /api/upload/user-photo
uploadRouter.post('/user-photo', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) { res.status(400).json({ message: 'Arquivo não enviado.' }); return; }
    const key = `${Date.now()}-${req.file.originalname.replace(/\s/g, '_')}`;
    const url = await uploadToS3(BUCKETS.fotos, key, req.file.buffer, req.file.mimetype);
    res.json({ url });
  } catch (e) {
    console.error('Upload error:', e);
    res.status(500).json({ message: 'Erro ao fazer upload da foto.' });
  }
});
