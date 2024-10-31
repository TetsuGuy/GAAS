import { spawn } from "child_process"
import path from "path"
import { ImageProvider } from "./ImageProvider"

export class ImageProviderPython implements ImageProvider {
  getImage(): Promise<any> {
    throw Error("not implemented")
  }
  saveImage(): Promise<any> {
    throw Error("not implemented")
  }
  getRandomImage(): Promise<any> {
    throw Error("not implemented")
  }
  createImage(): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
      const pythonProcess = spawn("python", ["../python/fluxTxt2Img.py"])
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}`))
        } else {
          const imagePath = path.join(__dirname, "IMG.png")
          resolve(imagePath)
        }
      })
    })
    return promise
  }
}