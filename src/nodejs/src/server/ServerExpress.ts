import express, { Application } from "express"
import { Server } from "./Server"
import { auth } from "./middleware/auth"
import { routerV1 } from "./routes/v1/routesV1"
import { createWebSocketServer } from "./websocket/websocketServer"
import { API_VERSION_URL } from "./routes"

export class ServerExpress implements Server {
  constructor(public app: Application) {}
  setup() {
    try {
      const port = process.env.PORT || 3000
      this.app.use(express.static(global.PATH_FRONTEND_BUILD))
      this.app.use(API_VERSION_URL, auth, routerV1)
      const webSocketServer = createWebSocketServer()
      this.app.listen(port, () => {
        console.log(`Server running on port ${port}`)
      })
    } catch (e) {
      console.error(e)
    }
  }
}
