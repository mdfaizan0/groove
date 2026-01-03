import express from "express"
import { requireAuth } from "../middlewares/auth.middleware.js"
import {
    addTrackToPlaylist,
    createPlaylist,
    getAllPlaylists,
    getPlaylistTracks,
    removePlaylist,
    removeTrackFromPlaylist,
    updatePlaylist
}
    from "../controllers/playlist.controller.js"

const router = express.Router()

// Playlist Routes
router.get("/", requireAuth, getAllPlaylists)
router.post("/", requireAuth, createPlaylist)
router.patch("/:id", requireAuth, updatePlaylist)
router.delete("/:id", requireAuth, removePlaylist)

// Playlist Tracks Routes
router.get("/:id", requireAuth, getPlaylistTracks)
router.post("/:id", requireAuth, addTrackToPlaylist)
router.delete("/:id/:trackId", requireAuth, removeTrackFromPlaylist)

export default router