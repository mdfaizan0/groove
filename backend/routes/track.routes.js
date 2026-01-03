import express from "express"
import { getAllTracks } from "../controllers/track.controller.js"

const router = express.Router()

router.get("/", getAllTracks)

export default router