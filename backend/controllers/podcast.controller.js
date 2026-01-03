import { supabase } from "../lib/supabase.js";

export async function getAllPodcastsCollections(req, res) {
    try {
        const { data, error } = await supabase
            .from("podcast_collections")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching podcasts:", error)
            return res.status(500).json({ message: "DB error: getting all podcasts.", code: error.code })
        }

        return res.status(200).json({ success: true, podcastCollections: data })
    } catch (error) {
        console.error("Error fetching podcasts collections:", error.message)
        return res.status(500).json({ message: "Error fetching podcasts collections" })
    }
}

export async function getAllPodcastEpisodes(req, res) {
    try {
        const { data, error } = await supabase
            .from("podcast_episodes")
            .select("*")
            .eq("collection_id", req.params.collectionId)
            .order("published_at", { ascending: false })

        if (error) {
            console.error("Error fetching podcast episodes:", error)
            return res.status(500).json({ message: "DB error: getting all podcast episodes.", code: error.code })
        }

        return res.status(200).json({ success: true, podcastEpisodes: data })
    } catch (error) {
        console.error("Error fetching podcast episodes:", error.message)
        return res.status(500).json({ message: "Error fetching podcast episodes" })
    }
}

export async function getAPodcast(req, res) {
    try {
        const { data, error } = await supabase
            .from("podcast_collections")
            .select("*")
            .eq("id", req.params.collectionId)

        if (error || data.length === 0) {
            console.error("Error fetching podcast:", error)
            return res.status(500).json({ message: "DB error: getting a podcast.", code: error.code })
        }

        return res.status(200).json({ success: true, podcast: data[0] })
    } catch (error) {
        console.error("Error fetching podcast:", error.message)
        return res.status(500).json({ message: "Error fetching podcast" })
    }
}