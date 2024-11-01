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
      const pythonProcess = spawn("python", ["../python/fluxTxt2Img.py"])
      let seed: number | null = null

      pythonProcess.stdout.on("data", (data) => {
        const output = data.toString()
        const seedMatch = output.match(/Generated seed: (\d+)/)
        if (seedMatch) {
          seed = parseInt(seedMatch[1], 10)
        }
      })

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          throw Error(`Python script exited with code ${code}`)
        } else {
          const imagePath = path.join(__dirname, `_${seed}_IMG.png`)
          if (seed !== null) {
            resolve(imagePath)
          } else {
            throw Error("Seed not found in Python script output")
          }
        }
      })
    })
    return promise
  }
}
