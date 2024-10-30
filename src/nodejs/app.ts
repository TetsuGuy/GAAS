// !don't move this! --v
import dotenv from "dotenv"
dotenv.config()

import { ServerExpress } from "./src/server/ServerExpress"
import express from "express"
const app = express()
const server = new ServerExpress(app)
server.setup()
