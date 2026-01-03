import { supabase } from "../lib/supabase.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// --- CATEGORIES ---
export async function createCategory(req, res) {
    try {
        const { name } = req.body;
        const { data, error } = await supabase
            .from("categories")
            .insert([{ name }])
            .select();

        if (error) throw error;
        return res.status(201).json({ success: true, category: data[0] });
    } catch (error) {
        console.error("Create Category Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const { data, error } = await supabase
            .from("categories")
            .update({ name })
            .eq("id", id)
            .select();

        if (error) throw error;
        return res.status(200).json({ success: true, category: data[0] });
    } catch (error) {
        console.error("Update Category Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) throw error;
        return res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.error("Delete Category Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

// --- TRACKS ---
async function uploadToSupabase(file, bucket) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function createTrack(req, res) {
    try {
        const { title, artist, duration, category_id } = req.body;
        const audioFile = req.files?.audioFile?.[0];
        const coverImage = req.files?.coverImage?.[0];

        if (!audioFile || !coverImage) {
            return res.status(400).json({ message: "Audio file and cover image are required" });
        }

        const audio_url = await uploadToSupabase(audioFile, "tracks");
        const cover_url = await uploadToSupabase(coverImage, "covers");

        const { data, error } = await supabase
            .from("tracks")
            .insert([{
                title,
                artist,
                duration,
                category_id,
                audio_path: audio_url,
                cover_image_path: cover_url
            }])
            .select();

        if (error) throw error;
        return res.status(201).json({ success: true, track: data[0] });
    } catch (error) {
        console.error("Create Track Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function updateTrack(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Note: File updates are out of scope as per prompt, so we only update metadata
        const { data, error } = await supabase
            .from("tracks")
            .update(updates)
            .eq("id", id)
            .select();

        if (error) throw error;
        return res.status(200).json({ success: true, track: data[0] });
    } catch (error) {
        console.error("Update Track Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteTrack(req, res) {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("tracks").delete().eq("id", id);
        if (error) throw error;
        return res.status(200).json({ success: true, message: "Track deleted" });
    } catch (error) {
        console.error("Delete Track Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

// --- PODCAST COLLECTIONS ---
export async function createPodcast(req, res) {
    try {
        const { title, description } = req.body;
        const coverImage = req.file;

        if (!coverImage) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        const cover_url = await uploadToSupabase(coverImage, "covers");

        const { data, error } = await supabase
            .from("podcast_collections")
            .insert([{ title, description, cover_image_url: cover_url }])
            .select();

        if (error) throw error;
        return res.status(201).json({ success: true, podcast: data[0] });
    } catch (error) {
        console.error("Create Podcast Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function updatePodcast(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase
            .from("podcast_collections")
            .update(updates)
            .eq("id", id)
            .select();

        if (error) throw error;
        return res.status(200).json({ success: true, podcast: data[0] });
    } catch (error) {
        console.error("Update Podcast Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function deletePodcast(req, res) {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("podcast_collections").delete().eq("id", id);
        if (error) throw error;
        return res.status(200).json({ success: true, message: "Podcast collection deleted" });
    } catch (error) {
        console.error("Delete Podcast Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

// --- PODCAST EPISODES ---
export async function createPodcastEpisode(req, res) {
    try {
        const { title, description, duration, collection_id } = req.body;
        const audioFile = req.file;

        if (!audioFile) {
            return res.status(400).json({ message: "Audio file is required" });
        }

        const audio_url = await uploadToSupabase(audioFile, "podcasts");

        const { data, error } = await supabase
            .from("podcast_episodes")
            .insert([{ title, description, duration, collection_id, audio_path: audio_url }])
            .select();

        if (error) throw error;
        return res.status(201).json({ success: true, episode: data[0] });
    } catch (error) {
        console.error("Create Episode Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function updatePodcastEpisode(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase
            .from("podcast_episodes")
            .update(updates)
            .eq("id", id)
            .select();

        if (error) throw error;
        return res.status(200).json({ success: true, episode: data[0] });
    } catch (error) {
        console.error("Update Episode Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}

export async function deletePodcastEpisode(req, res) {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("podcast_episodes").delete().eq("id", id);
        if (error) throw error;
        return res.status(200).json({ success: true, message: "Episode deleted" });
    } catch (error) {
        console.error("Delete Episode Error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}
