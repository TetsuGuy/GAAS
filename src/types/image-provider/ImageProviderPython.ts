import { spawn } from "child_process"
import path from "path"
import { ImageProvider } from "./ImageProvider"

export class ImageProviderPython implements ImageProvider {
  getImage(): Promise<any> {
    throw Error("Not yet implemented")
  }
  saveImage(): Promise<any> {
    throw Error("Not yet implemented")
  }
  createImage(): Promise<string> {
    const promise = new Promise<string>((resolve) => {
      const pythonProcess = spawn("python", ["src/python/fluxTxt2Img.py"])
      pythonProcess.on("close", (_code: any) => {
        const imagePath = path.join(__dirname, "image.png")
        resolve(imagePath)
      })
    })
    return promise
  }
}
