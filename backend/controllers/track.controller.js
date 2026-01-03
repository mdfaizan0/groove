import { supabase } from "../lib/supabase.js";

export async function getAllTracks(req, res) {
    try {
        const { data, error } = await supabase
            .from("tracks")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching tracks:", error)
            return res.status(500).json({ message: "DB error: getting all tracks.", code: error.code })
        }

        return res.status(200).json({ success: true, tracks: data })
    } catch (error) {
        console.error("Error fetching tracks:", error.message)
        return res.status(500).json({ message: "Error fetching tracks" })
    }
}