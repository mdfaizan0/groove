import { supabase } from "../lib/supabase.js";

export async function searchAll(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(200).json({ tracks: [], podcasts: [] });
    }

    try {
        // Search tracks
        const { data: tracks, error: tracksError } = await supabase
            .from("tracks")
            .select("*")
            .or(`title.ilike.% q %,artist.ilike.% q %`.replace(/q/g, q))
            .limit(10);

        if (tracksError) throw tracksError;

        // Search podcast episodes joined with their collections
        const { data: episodes, error: episodesError } = await supabase
            .from("podcast_episodes")
            .select(`
                *,
                podcast:podcast_collections (*)
            `)
            .or(`title.ilike.% q %,description.ilike.% q %`.replace(/q/g, q))
            .limit(20);

        if (episodesError) throw episodesError;

        return res.status(200).json({
            tracks: tracks || [],
            episodes: episodes || []
        });
    } catch (error) {
        console.error("Search error:", error.message);
        return res.status(500).json({ message: "Error performing search", error: error.message });
    }
}
