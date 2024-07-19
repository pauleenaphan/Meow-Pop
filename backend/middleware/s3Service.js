const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: process.env.AWS_REGION }); // Replace with your AWS region

const uploadToS3 = async (files) => {
    const uploadedFiles = [];

    for (const file of files) {
        const uploadParams = {
            Bucket: 'meow-pop-items', // Replace with your bucket name
            Key: `images/${Date.now()}-${file.originalname}`, // Unique file name
            Body: file.buffer, // The file data
            ContentType: file.mimetype, // File MIME type
        };

        try {
            const command = new PutObjectCommand(uploadParams);
            const data = await s3Client.send(command);
            uploadedFiles.push({
                Location: `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`, // Construct the file URL
                ...data,
            });
        } catch (error) {
            console.error("Error uploading file to S3", error);
            throw error;
        }
    }

    return uploadedFiles;
};

module.exports = uploadToS3;
