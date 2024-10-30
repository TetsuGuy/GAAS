import { ImageProvider } from "./ImageProvider"
import AWS from "aws-sdk"

export class ImageProviderAws implements ImageProvider {
  private s3: AWS.S3
  private bucket: string
  private nextImageCounter = 0
  private nextImages = []

  constructor() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION
    const bucket = process.env.S3_BUCKET_NAME
    if (!accessKeyId || !secretAccessKey || !region || !bucket) {
      throw Error("Can't initialize ImageProviderAWS. Missing values.")
    }

    this.s3 = new AWS.S3({
      accessKeyId,
      secretAccessKey,
      region,
    })
    this.bucket = bucket
  }

  async getImages(): Promise<AWS.S3.Object[]> {
    const requestParams = { Bucket: this.bucket }
    const data = await this.s3.listObjectsV2(requestParams).promise()
    if (!data.Contents) {
      throw new Error("Can't find image data")
    }
    const imageFiles = data.Contents.filter(
      (file) =>
        file.Key?.endsWith(".jpg") ||
        file.Key?.endsWith(".png") ||
        file.Key?.endsWith(".jpeg") ||
        file.Key?.endsWith(".gif")
    )
    if (imageFiles.length === 0) {
      throw new Error("Not Found")
    }
    return imageFiles
  }

  async getImage(imageId: string) {
    const requestParams = { Bucket: this.bucket, Key: imageId }
    return this.s3.getObject(requestParams).promise()
  }

  async getNextImage(): Promise<{
    buffer: Buffer
    type: string
    index: number
  }> {
    let images = []
    if (!this.nextImages.length) {
      images = await this.getImages()
    }
    if (!images.length) {
      throw Error("Can't get image")
    }
    const image = images[this.nextImageCounter]
    if (this.nextImageCounter < images.length - 1) {
      this.nextImageCounter++
    } else {
      this.nextImageCounter = 0
    }
    const imageData = await this.getImage(image.Key)
    const buffer = imageData.Body as Buffer
    const type = imageData.ContentType
    const index = this.nextImageCounter
    return { buffer, type, index }
  }

  async getRandomImage(): Promise<{ buffer: Buffer; type: string }> {
    const imageFiles = await this.getImages()
    const randomImage =
      imageFiles[Math.floor(Math.random() * imageFiles.length)]

    if (!randomImage.Key) {
      throw Error("Can't get random image")
    }

    const imageData = await this.getImage(randomImage.Key)
    const buffer = imageData.Body as Buffer
    const type = imageData.ContentType
    return { buffer, type }
  }

  async saveImage(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.bucket,
      Key: `${Date.now()}_${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
    }

    const result = await this.s3.upload(uploadParams).promise()
    return result.Location
  }

  createImage(): Promise<any> {
    throw Error("Not yet implemented")
  }
}
