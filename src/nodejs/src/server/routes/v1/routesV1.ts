import express from "express"
import { ImageProviderAws } from "../../../image-provider/ImageProviderAws"
import { ImageProviderPython } from "../../../image-provider/ImageProviderPython"
import { GothController } from "../../controllers/GothController"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()
const imageProviderAws = new ImageProviderAws()
const imageProviderPython = new ImageProviderPython()
const controller = new GothController(imageProviderAws, imageProviderPython)

router.get("/get", (req, res) => controller.get(req, res))
router.get("/upload", (req, res) => controller.uploadGet(req, res))
router.post("/upload", upload.single("image"), (req, res) => controller.uploadPost(req, res))
router.get("/generate", (req, res) => controller.generate(req, res))
router.get("/next", (req, res) => controller.next(req, res))
router.get("/create", (req, res) => controller.create(req, res))

export const routerV1 = router
