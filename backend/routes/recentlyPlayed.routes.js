import express from "express";
import { getRecentlyPlayed, upsertRecentlyPlayed } from "../controllers/recentlyPlayed.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getRecentlyPlayed);
router.post("/", requireAuth, upsertRecentlyPlayed);

export default router;
