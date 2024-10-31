// !don't move this! --v
import dotenv from "dotenv"
dotenv.config()

import { ServerExpress } from "./src/server/ServerExpress"
import express from "express"

import path from "path"
global.PATH_FRONTEND = path.join(__dirname, "../../svelte")
global.PATH_FRONTEND_BUILD = path.join(global.PATH_FRONTEND, "public")
global.PATH_FRONTEND_INDEX = path.join(global.PATH_FRONTEND_BUILD, "index.html")

const app = express()
const server = new ServerExpress(app)
server.setup()
