// backend/server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const upload = multer({ dest: 'uploads/' }); // Set destination for uploads

// Enable CORS for all routes
app.use(cors());

// API endpoint to upload images
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    console.log('Image uploaded:', imageUrl); // Log the uploaded image URL

    const qrCodeUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(imageUrl)}`;
    console.log('Generated QR Code URL:', qrCodeUrl); // Log the generated QR Code URL

    res.json({ qrCodeUrl });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
