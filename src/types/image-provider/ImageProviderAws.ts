import { ImageProvider } from "./ImageProvider";
import AWS from "aws-sdk";

export class ImageProviderAws implements ImageProvider {
    private s3: AWS.S3
    private bucket: string

    constructor() {
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET_NAME;

        if (!accessKeyId || !secretAccessKey || !region || !bucket) {
            throw Error("Can't initialize ImageProviderAWS. Missing values.");
        }

        // S3 Bucket
        this.s3 = new AWS.S3({
            accessKeyId,
            secretAccessKey,
            region
        });
        this.bucket = bucket
    }

    async getImage(): Promise<{ buffer: Buffer, type: string }> {
        const params = {
            Bucket: this.bucket,
        };
        const data = await this.s3.listObjectsV2(params).promise();
        if (!data.Contents) {
            throw new Error("Can't find image data");
        }
        const imageFiles = data.Contents.filter(file =>
            file.Key?.endsWith('.jpg') || file.Key?.endsWith('.png') ||
            file.Key?.endsWith('.jpeg') || file.Key?.endsWith('.gif')
        );
        if (imageFiles.length === 0) {
            throw new Error("Not Found");
        }

        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];

        if (!randomImage.Key) {
            throw Error("Can't get random image")
        }

        const imageParams = {
            Bucket: this.bucket,
            Key: randomImage.Key,
        };

        const imageData = await this.s3.getObject(imageParams).promise();
        const buffer = imageData.Body as Buffer;
        const type = imageData.ContentType
        return { buffer, type }
    }

    async saveImage(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
        const uploadParams = {
            Bucket: this.bucket,
            Key: `uploads/${Date.now()}_${fileName}`,
            Body: fileBuffer,
            ContentType: mimeType,
        };

        const result = await this.s3.upload(uploadParams).promise();
        return result.Location;
    }

    createImage(): Promise<any> {
        throw Error("Not yet implemented")
    }
}
