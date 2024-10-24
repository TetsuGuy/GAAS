import { Server } from "./Server";
import { Request, Response, Application, NextFunction } from 'express';

import { ImageProviderAws } from "../image-provider/ImageProviderAws";
import { ImageProviderPython } from "../image-provider/ImageProviderPython";

export class ServerExpress implements Server {
  constructor(public app: Application) {}

  private checkApiKey(req: Request, res: Response, next: NextFunction) {
    const VALID_API_KEY = process.env.API_KEY;
    const apiKey = req.query.api_key || req.headers['x-api-key'];
    if (!apiKey) {
      res.status(401).json({ error: 'API key is missing' });
      return
    }
    if (apiKey !== VALID_API_KEY) {
      res.status(403).json({ error: 'Invalid API key' });
      return
    }
    next();
  }

  setup() {
    try {
      const imageProviderAws = new ImageProviderAws()
      const imageProviderPython = new ImageProviderPython()

      const port = process.env.PORT || 3000;

      this.app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
  
      this.app.get('/get', this.checkApiKey, async (req: Request, res: Response) => {
        try{
          const { buffer, type } = await imageProviderAws.getImage()
          res.setHeader('Content-Type', type);
          res.send(buffer);
        } catch(e) {
          if(e === "Not found") {
            res.status(404).send({ error: "Image not found" })
          } else {
            res.status(500).send("Server Error:" + e)
          }
        }
      });
  
      this.app.get('/create', async (_req: Request, res: Response) => {
        try {
          const imagePath = await imageProviderPython.createImage()
          res.sendFile(imagePath, (err: any) => {
            if (err) {
              res.status(500).send('Error generating image' + err);
            }
          });
        } catch (e) {
          res.status(500).send('Error generating image:' + e );
        }
      });
    } catch (e) {
      console.error(e)
    }
  }
}