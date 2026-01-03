import { supabase } from "./supabase.js";

export async function getNewPosition(playlistId) {
    try {
        const { data, error } = await supabase
            .from("playlist_tracks")
            .select("position")
            .order("position", { ascending: false })
            .eq("playlist_id", playlistId)
            .limit(1)

        if (data.length === 0) {
            return 1
        }

        if (error && error.code === "PGRST116") {
            console.log("Error fetching new position", error)
            return 1
        }

        return data[0].position + 1
    } catch (error) {
        console.log("Error fetching new position", error)
        return 1
    }
}