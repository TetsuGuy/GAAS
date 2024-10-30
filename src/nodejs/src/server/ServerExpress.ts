import express, { Application } from "express"
import path from "path"
import { Server } from "./Server"
import { auth } from "./middleware/auth"
import { routerV1 } from "./routes/v1/routesV1"
import { createWebSocketServer } from "./websocket/websocketServer"

export class ServerExpress implements Server {
  constructor(public app: Application) {}
  setup() {
    try {
      const port = process.env.PORT || 3000
      const rootDir = path.resolve(__dirname, "..", "..", "..")
      const webSocketServer = createWebSocketServer()
      this.app.use(express.static(path.join(rootDir, "svelte", "public")))
      this.app.use("/api/v1", auth, routerV1)
      this.app.listen(port, () => {
        console.log(`Server running on port ${port}`)
      })
    } catch (e) {
      console.error(e)
    }
  }
}
