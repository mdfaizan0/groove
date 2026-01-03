import { supabase } from "../lib/supabase.js";

export async function getAllCategories(req, res) {
    try {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching categories:", error)
            return res.status(500).json({ message: "DB error: getting all categories.", code: error.code })
        }

        return res.status(200).json({ success: true, categories: data })
    } catch (error) {
        console.error("Error fetching categories:", error.message)
        return res.status(500).json({ message: "Error fetching categories" })
    }
}