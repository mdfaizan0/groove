import { supabase } from "../lib/supabase.js";

export async function searchAll(req, res) {
    const { q } = req.query;

    if (!q || !q.trim()) {
        return res.status(200).json({ tracks: [], episodes: [] });
    }

    const search = `%${q}%`;

    try {
        // Search tracks
        const { data: tracks, error: tracksError } = await supabase
            .from("tracks")
            .select("*")
            .or(`title.ilike.${search},artist.ilike.${search}`)
            .limit(10);

        if (tracksError) throw tracksError;

        // Search podcast episodes with collection
        const { data: episodes, error: episodesError } = await supabase
            .from("podcast_episodes")
            .select(`
                *,
                podcast:podcast_collections (*)
            `)
            .or(`title.ilike.${search},description.ilike.${search}`)
            .limit(20);

        if (episodesError) throw episodesError;

        return res.status(200).json({
            tracks: tracks || [],
            episodes: episodes || []
        });
    } catch (error) {
        console.error("Search error:", error.message);
        return res.status(500).json({
            message: "Error performing search",
            error: error.message
        });
    }
}