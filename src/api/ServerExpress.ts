import { ImageProvider } from "./ImageProvider";
import { IServer } from "./IServer";
import { Request, Response } from 'express';

import { spawn } from 'child_process';
import path from "path";

export class ServerExpress implements IServer {
  constructor(public app: Express.Application | any, public imageProvider: ImageProvider) { }

  private checkApiKey(req: Request, res: Response, next: () => any) {
    const VALID_API_KEY = process.env.API_KEY;

    const apiKey = req.query.api_key || req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key is missing' });
    }

    if (apiKey !== VALID_API_KEY) {
      return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
  }

  setup() {
    try {
      const port = process.env.PORT || 3000;
    
      this.app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
  
      this.app.get('/get', this.checkApiKey, async (req: Request, res: Response) => {
        try{
          const { buffer, type } = await this.imageProvider.getImage()
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
  
      this.app.get('/create', (req: Request, res: Response) => {
        // Spawn a child process to run the Python script
        const pythonProcess = spawn('python', ['prompt.py']);
      
        pythonProcess.on('close', (_code: any) => {
          // Assuming the Python script saves the image as 'test_image.png'
          const imagePath = path.join(__dirname, 'test_image.png');
          res.sendFile(imagePath, (err: any) => {
            if (err) {
              console.error("Error generating image", err);
              res.status(500).send('Error generating image');
            }
          });
        });
      });
    } catch (e) {
      console.error(e)
    }
  }
}