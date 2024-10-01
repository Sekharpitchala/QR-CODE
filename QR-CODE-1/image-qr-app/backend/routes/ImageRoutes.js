const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');
const Image = require('../models/Image');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const qrCodeUrl = await QRCode.toDataURL(`http://localhost:5000${imageUrl}`);

    const newImage = new Image({
      filename: req.file.filename,
      imageUrl,
      qrCode: qrCodeUrl,
    });

    await newImage.save();
    res.json({ imageUrl, qrCodeUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});

router.get('/', async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

module.exports = router;
