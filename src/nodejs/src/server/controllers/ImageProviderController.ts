import { Request, Response } from "express"
import { ImageProviderAws } from "../../image-provider/ImageProviderAws"
import { ImageProviderPython } from "../../image-provider/ImageProviderPython"
import { MulterRequest } from "../utils"
import fs from "fs"
import { buildUrl } from "../routes"

export class ImageProviderController {
  constructor(
    public imageProviderAws: ImageProviderAws,
    public imageProviderPython: ImageProviderPython
  ) {}

  // Helper method for sending errors
  private sendErrorResponse(
    response: Response,
    statusCode: number,
    message: string
  ) {
    response.status(statusCode).send({ error: message })
  }

  async get(_request: Request, response: Response): Promise<void> {
    try {
      const { buffer, type } = await this.imageProviderAws.getRandomImage()
      response.setHeader("Content-Type", type)
      response.send(buffer)
    } catch (e) {
      if (e === "Not found") {
        this.sendErrorResponse(response, 404, "Image not found")
      } else {
        this.sendErrorResponse(response, 500, `Server Error: ${e}`)
      }
    }
  }

  async uploadGet(_request: Request, response: Response): Promise<void> {
    response.send(`
            <html>
                <body>
                    <form action="${buildUrl("upload")}" method="POST" enctype="multipart/form-data">
                        <input type="file" name="image" accept="image/*" required />
                        <button type="submit">Upload Image</button>
                    </form>
                </body>
            </html>
        `)
  }

  async uploadPost(
    request: Request & MulterRequest,
    response: Response
  ): Promise<void> {
    try {
      if (!request.file) {
        this.sendErrorResponse(response, 400, "No file uploaded.")
        return
      }

      const { buffer, originalname, mimetype } = request.file
      await this.imageProviderAws.saveImage(buffer, originalname, mimetype)
      response.send(
        `File ${originalname} uploaded successfully. You can close this window now.`
      )
    } catch (e) {
      this.sendErrorResponse(response, 500, "Error uploading file")
      console.error(e)
    }
  }

  async generate(_request: Request, response: Response): Promise<void> {
    response.sendFile(global.PATH_FRONTEND_INDEX)
  }

  async next(_request: Request, response: Response): Promise<void> {
    try {
      const { buffer, type, index } = await this.imageProviderAws.getNextImage()
      response.setHeader("Content-Type", type)
      response.setHeader("X-Index", index)
      response.send(buffer)
    } catch (e) {
      if (e === "Not found") {
        this.sendErrorResponse(response, 404, "Image not found")
      } else {
        this.sendErrorResponse(response, 500, `Server Error: ${e}`)
      }
      console.error(e)
    }
  }

  async create(_request: Request, response: Response): Promise<void> {
    try {
      const imagePath = await this.imageProviderPython.createImage()

      response.sendFile(imagePath, (err: any) => {
        if (err) {
          this.sendErrorResponse(response, 500, "Error generating image")
          console.error(err)
          return // Ensure to exit the callback after sending the response
        }

        // Only delete the image after confirming the response was sent
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image", err)
          }
        })
      })
    } catch (e) {
      this.sendErrorResponse(response, 500, "Error generating image")
      console.error(e) // Log the error for debugging
    }
  }
}
