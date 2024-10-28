import express, { Request, Response, Application, NextFunction } from "express"
import multer from "multer"
import fs from "fs"
import WebSocket from "ws"
import path from "path"

import { Server } from "./Server"
import { ImageProviderAws } from "../image-provider/ImageProviderAws"
import { ImageProviderPython } from "../image-provider/ImageProviderPython"

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
      const upload = multer({ storage: multer.memoryStorage() })
      const imageProviderAws = new ImageProviderAws()
      const imageProviderPython = new ImageProviderPython()
      const port = process.env.PORT || 3000
      const wsport = process.env.WSPORT || 3001
      const rootDir = path.resolve(__dirname, "..", "..", "..")

      this.app.use(express.static(path.join(rootDir, "svelte", "public")))

      const server = this.app.listen(port, () => {
        console.log(`Server running on port ${port}`)
      })

      const wss = new WebSocket.Server({ port: wsport as number })

      wss.on("connection", (ws) => {
        console.log("Client connected")

        ws.on("message", (message: string) => {
          const data = JSON.parse(message)
          if (data.action === "generate") {
            // Simulate image generation
            setTimeout(() => {
              const generatedImageUrl =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSctuz6PbqpENPriLnMkKVP0u_Cyn-Hfd7xCQ&s" // Replace with actual URL
              ws.send(JSON.stringify({ image: generatedImageUrl }))
            }, 3000) // Simulating a delay for image generation
          }
        })

        ws.on("close", () => {
          console.log("Client disconnected")
        })
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
        "/generate",
        this.checkApiKey,
        async (req: Request, res: Response) => {
          res.sendFile(path.join(rootDir, "svelte", "public", "index.html"))
        }
      )

      this.app.get(
        "/create",
        this.checkApiKey,
        async (_req: Request, res: Response) => {
          try {
            const imagePath = await imageProviderPython.createImage()

            res.sendFile(imagePath, (err: any) => {
              fs.unlink(imagePath, (err) => {
                if (err) {
                  console.error("Error deleting image", err)
                }
              })

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
