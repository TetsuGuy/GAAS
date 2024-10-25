import { Server } from "./Server"
import { Request, Response, Application, NextFunction } from "express"

import { ImageProviderAws } from "../image-provider/ImageProviderAws"
import { ImageProviderPython } from "../image-provider/ImageProviderPython"
import multer from "multer"
import { error } from "console"
const upload = multer({ storage: multer.memoryStorage() })

interface MulterRequest {
  file?: {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    size: number
    buffer: Buffer
  }
}

export class ServerExpress implements Server {
  constructor(public app: Application) {}

  private checkApiKey(req: Request, res: Response, next: NextFunction) {
    const VALID_API_KEY = process.env.API_KEY
    const apiKey = req.query.api_key || req.headers["x-api-key"]
    if (!apiKey) {
      res.status(401).send("API key is missing")
      return
    }
    if (apiKey !== VALID_API_KEY) {
      res.status(403).send("Invalid API key")
      return
    }
    next()
  }

  setup() {
    try {
      const imageProviderAws = new ImageProviderAws()
      const imageProviderPython = new ImageProviderPython()

      const port = process.env.PORT || 3000

      this.app.listen(port, () => {
        console.log(`Server running on port ${port}`)
      })

      this.app.get(
        "/get",
        this.checkApiKey,
        async (req: Request, res: Response) => {
          try {
            const { buffer, type } = await imageProviderAws.getImage()
            res.setHeader("Content-Type", type)
            res.send(buffer)
          } catch (e) {
            if (e === "Not found") {
              res.status(404).send({ error: "Image not found" })
            } else {
              res.status(500).send("Server Error:" + e)
            }
          }
        }
      )

      this.app.get("/upload", (req: Request, res: Response) => {
        res.send(`
          <html>
            <body>
              <form action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="image" accept="image/*" required />
                <button type="submit">Upload Image</button>
              </form>
            </body>
          </html>
        `)
      })

      this.app.post(
        "/upload",
        upload.single("image"),
        async (req: Request & MulterRequest, res: Response) => {
          try {
            if (!req.file) {
              res.status(400).send("No file uploaded.")
              return
            }
            const { buffer, originalname, mimetype } = req.file
            const imageUrl = await imageProviderAws.saveImage(
              buffer,
              originalname,
              mimetype
            )
            res.send(
              `File ${originalname} uploaded successfully. You can close this window now.`
            )
          } catch (e) {
            res.status(500).send("Error uploading file")
            throw e
          }
        }
      )

      this.app.get(
        "/create",
        this.checkApiKey,
        async (_req: Request, res: Response) => {
          try {
            const imagePath = await imageProviderPython.createImage()
            res.sendFile(imagePath, (err: any) => {
              if (err) {
                res.status(500).send("Error generating image")
                throw err
              }
            })
          } catch (e) {
            res.status(500).send("Error generating image:")
            throw e
          }
        }
      )
    } catch (e) {
      console.error(e)
    }
  }
}
