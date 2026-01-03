import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import trackRoutes from "./routes/track.routes.js"
import podcastRoutes from "./routes/podcast.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"
import searchRoutes from "./routes/search.routes.js"
import recentlyPlayedRoutes from "./routes/recentlyPlayed.routes.js"
import adminRoutes from "./routes/admin.routes.js"

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Let's Groove 🎶")
})

app.use("/api/tracks", trackRoutes)
app.use("/api/podcasts", podcastRoutes)
app.use("/api/playlists", playlistRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/recently-played", recentlyPlayedRoutes)
app.use("/api/admin", adminRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))