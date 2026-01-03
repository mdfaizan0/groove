import { supabase } from "../lib/supabase.js";

export async function upsertRecentlyPlayed(req, res) {
    const { trackId, lastPosition } = req.body;
    const userId = req.user.id;

    if (!trackId) {
        return res.status(400).json({ message: "trackId is required" });
    }

    try {
        const { data, error } = await supabase
            .from("recently_played")
            .upsert(
                {
                    user_id: userId,
                    track_id: trackId,
                    last_position: lastPosition || 0,
                    played_at: new Date().toISOString(),
                },
                { onConflict: "user_id,track_id" }
            )
            .select();

        if (error) {
            console.error("Error upserting recently played:", error);
            return res.status(500).json({ message: "DB error", error });
        }

        return res.status(200).json({ success: true, data: data[0] });
    } catch (error) {
        console.error("Error upserting recently played:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getRecentlyPlayed(req, res) {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from("recently_played")
            .select(`
                *,
                track:tracks (*)
            `)
            .eq("user_id", userId)
            .order("played_at", { ascending: false })
            .limit(20);

        if (error) {
            console.error("Error fetching recently played:", error);
            return res.status(500).json({ message: "DB error", error });
        }

        // Flatten the track data to match standard track object format if desired,
        // or just return as is. The prompt says "Returns latest 20 tracks. Join with tracks table."
        const tracks = data.map(rp => ({
            ...rp.track,
            last_position: rp.last_position,
            played_at: rp.played_at
        }));

        return res.status(200).json({ success: true, tracks });
    } catch (error) {
        console.error("Error fetching recently played:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
