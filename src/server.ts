
import { ServerExpress } from "./api/ServerExpress";
import { ImageProviderAws } from "./api/ImageProviderAws";

import express from "express";
import dotenv from "dotenv"

dotenv.config();  
const app = express();

const imageProviderAws = new ImageProviderAws()
const server = new ServerExpress(app, imageProviderAws)
server.setup()