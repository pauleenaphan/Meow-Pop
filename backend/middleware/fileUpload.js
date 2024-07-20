const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// Configure AWS S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Multer setup to handle in-memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
});

const uploadMiddleware = upload.array('images');

// Function to upload files directly to S3
const uploadToS3 = async (files) => {
    const uploadPromises = files.map(file => {
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: Date.now().toString() + path.extname(file.originalname),
                Body: file.buffer,
                ACL: 'public-read',
            },
        });
        return upload.done();
    });

    return Promise.all(uploadPromises);
};


module.exports = { upload, uploadToS3, uploadMiddleware };
