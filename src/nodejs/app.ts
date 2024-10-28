import { ServerExpress } from "./src/server/ServerExpress"

import express from "express"
import dotenv from "dotenv"

dotenv.config()
const app = express()
const server = new ServerExpress(app)
server.setup()
