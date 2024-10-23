const express = require('express');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const { spawn } = require('child_process');
const path = require('path');

dotenv.config();
const app = express();

const VALID_API_KEY = process.env.API_KEY;

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;


function checkApiKey(req, res, next) {
  const apiKey = req.query.api_key || req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  if (apiKey !== VALID_API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}

app.get('/get', checkApiKey, async (req, res) => {
  // Spawn a child process to run the Python script
  const pythonProcess = spawn('python', ['prompt.py']);

  pythonProcess.on('close', (code) => {
    // Assuming the Python script saves the image as 'test_image.png'
    const imagePath = path.join(__dirname, 'test_image.png');
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(500).send('Error generating image');
      }
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
