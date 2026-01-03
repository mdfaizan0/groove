import express from "express"
import { getAllPodcastsCollections, getAllPodcastEpisodes, getAPodcast } from "../controllers/podcast.controller.js"

const router = express.Router()

router.get("/collections", getAllPodcastsCollections)
router.get("/:collectionId", getAPodcast)
router.get("/:collectionId/episodes", getAllPodcastEpisodes)

export default router