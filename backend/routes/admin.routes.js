import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { uploadTrackFiles, uploadPodcastCover, uploadPodcastAudio } from "../middlewares/upload.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

// Apply auth and admin protection to ALL routes
router.use(requireAuth);
router.use(requireAdmin);

// CATEGORY CRUD
router.post("/categories", adminController.createCategory);
router.patch("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

// TRACK CRUD
router.post("/tracks", uploadTrackFiles, adminController.createTrack);
router.patch("/tracks/:id", adminController.updateTrack);
router.delete("/tracks/:id", adminController.deleteTrack);

// PODCAST COLLECTION CRUD
router.post("/podcasts", uploadPodcastCover, adminController.createPodcast);
router.patch("/podcasts/:id", adminController.updatePodcast);
router.delete("/podcasts/:id", adminController.deletePodcast);

// PODCAST EPISODE CRUD
router.post("/podcast-episodes", uploadPodcastAudio, adminController.createPodcastEpisode);
router.patch("/podcast-episodes/:id", adminController.updatePodcastEpisode);
router.delete("/podcast-episodes/:id", adminController.deletePodcastEpisode);

export default router;
