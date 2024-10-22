const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Access the API key from the environment variable
const VALID_API_KEY = process.env.API_KEY;

// Middleware to check the API key
function checkApiKey(req, res, next) {
  const apiKey = req.query.api_key || req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  if (apiKey !== VALID_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  // If API key is valid, proceed to the next middleware or route handler
  next();
}

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route to return a random image, protected by the API key middleware
app.get('/get', checkApiKey, (req, res) => {
  const imagesDir = path.join(__dirname, 'images');

  // Read the files in the "images" folder
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Unable to read directory', err);
      return res.status(500).send('Server error');
    }

    // Filter to include only files with image extensions (jpg, png, etc.)
    const imageFiles = files.filter(file => {
      return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.gif');
    });

    if (imageFiles.length === 0) {
      return res.status(404).send('No images found');
    }

    // Pick a random image
    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];

    // Send the image back to the user
    res.sendFile(path.join(imagesDir, randomImage));
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
