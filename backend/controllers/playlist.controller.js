import { getNewPosition } from "../lib/handlePosition.js";
import { supabase } from "../lib/supabase.js";

export async function getAllPlaylists(req, res) {
    try {
        const { data, error } = await supabase
            .from("playlists")
            .select("*")
            .order("created_at", { ascending: false })
            .eq("user_id", req.user.id)

        if (data.length === 0) {
            return res.status(404).json({ message: "No playlists found" })
        }

        if (error) {
            console.error("Error fetching playlists:", error)
            return res.status(500).json({ message: "DB error: getting all playlists.", code: error.code })
        }

        return res.status(200).json({ success: true, playlists: data })
    } catch (error) {
        console.error("Error fetching playlists:", error.message)
        return res.status(500).json({ message: "Error fetching playlists" })
    }
}

export async function createPlaylist(req, res) {
    const name = req.body.name.trim()
    if (!name) {
        return res.status(400).json({ message: "Playlist name is required" })
    }
    if (name.length < 3) {
        return res.status(400).json({ message: "Playlist name must be at least 3 characters long" })
    }
    if (name.length > 60) {
        return res.status(400).json({ message: "Playlist name must be at most 60 characters long" })
    }
    try {
        const { data, error } = await supabase
            .from("playlists")
            .insert({
                name,
                user_id: req.user.id
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating playlist:", error)
            return res.status(500).json({ message: "DB error: creating playlist.", code: error.code })
        }

        return res.status(201).json({ success: true, playlist: data })
    } catch (error) {
        console.error("Error creating playlist:", error.message)
        return res.status(500).json({ message: "Error creating playlist" })
    }
}

export async function updatePlaylist(req, res) {
    const name = req.body.name.trim()
    const id = req.params.id
    if (!name) {
        return res.status(400).json({ message: "Playlist name is required" })
    }
    if (!id) {
        return res.status(400).json({ message: "Playlist ID is required" })
    }
    if (name.length < 3) {
        return res.status(400).json({ message: "Playlist name must be at least 3 characters long" })
    }
    if (name.length > 60) {
        return res.status(400).json({ message: "Playlist name must be at most 60 characters long" })
    }
    try {
        const { data, error } = await supabase
            .from("playlists")
            .update({ name })
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select()

        if (data.length === 0) {
            return res.status(404).json({ message: "Playlist not found" })
        }

        if (error) {
            console.error("Error updating playlist:", error)
            return res.status(500).json({ message: "DB error: updating playlist.", code: error.code })
        }

        return res.status(200).json({ success: true, playlist: data[0] })
    } catch (error) {
        console.error("Error updating playlist:", error.message)
        return res.status(500).json({ message: "Error updating playlist" })
    }
}

export async function removePlaylist(req, res) {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Playlist ID is required" })
    }
    try {
        const { data, error } = await supabase
            .from("playlists")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select()

        if (data.length === 0) {
            return res.status(404).json({ message: "Playlist not found" })
        }

        if (error) {
            console.error("Error removing playlist:", error)
            return res.status(500).json({ message: "DB error: removing playlist.", code: error.code })
        }

        return res.status(200).json({ success: true, message: "Removed playlist successfully" })
    } catch (error) {
        console.error("Error removing playlist:", error.message)
        return res.status(500).json({ message: "Error removing playlist" })
    }
}


export async function getPlaylistTracks(req, res) {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "Playlist ID is required" })
    }
    try {
        const { data: playlistExist, error: playlistExistError } = await supabase
            .from("playlists")
            .select("*")
            .eq("id", id)
            .eq("user_id", req.user.id)

        if (playlistExist.length === 0) {
            return res.status(404).json({ message: "Playlist not found" })
        }

        if (playlistExistError) {
            console.error("Error fetching playlist:", playlistExistError)
            return res.status(500).json({ message: "DB error: fetching playlist.", code: playlistExistError.code })
        }

        const { data, error } = await supabase
            .from("playlist_tracks")
            .select(`position, tracks(id, title, artist, duration, audio_path, cover_image_path)`)
            .eq("playlist_id", id)
            .order("position", { ascending: true })

        if (error) {
            console.error("Error fetching playlist tracks:", error)
            return res.status(500).json({ message: "DB error: fetching playlist tracks.", code: error.code })
        }

        const tracks = data.map(t => ({ ...t.tracks, position: t.position })) || []

        return res.status(200).json({ success: true, tracks, playlist: playlistExist[0] })
    } catch (error) {
        console.error("Error fetching playlist tracks:", error.message)
        return res.status(500).json({ message: "Error fetching playlist tracks" })
    }
}

export async function addTrackToPlaylist(req, res) {
    const { id } = req.params
    const { trackId } = req.body

    const position = await getNewPosition(id)
    try {
        const { data: playlistExist, error: playlistExistError } = await supabase
            .from("playlists")
            .select("*")
            .eq("id", id)
            .eq("user_id", req.user.id)

        if (playlistExist.length === 0) {
            return res.status(404).json({ message: "Playlist not found" })
        }

        if (playlistExistError) {
            console.error("Error fetching playlist:", playlistExistError)
            return res.status(500).json({ message: "DB error: fetching playlist.", code: playlistExistError.code })
        }

        const { data: trackExist, error: trackExistError } = await supabase
            .from("tracks")
            .select("id")
            .eq("id", trackId)

        if (trackExist.length === 0) {
            return res.status(404).json({ message: "Track not found" })
        }

        if (trackExistError) {
            console.error("Error fetching track:", trackExistError)
            return res.status(500).json({ message: "DB error: fetching track.", code: trackExistError.code })
        }

        const { data, error } = await supabase
            .from("playlist_tracks")
            .insert({ playlist_id: id, track_id: trackId, position })
            .select("*")
            .single()

        if (error?.code === "23505") {
            return res.status(409).json({ message: "Track already in playlist" })
        }

        if (error) {
            console.error("Error adding track to playlist:", error)
            return res.status(500).json({ message: "DB error: adding track to playlist.", code: error.code })
        }

        const { error: tracksCountUpdateError } = await supabase
            .from("playlists")
            .update({ tracks_count: playlistExist[0].tracks_count + 1 })
            .eq("id", playlistExist[0].id)

        if (tracksCountUpdateError) {
            console.error("Error updating tracks count:", tracksCountUpdateError)
            return res.status(500).json({ message: "DB error: updating tracks count.", code: tracksCountUpdateError.code })
        }

        return res.status(200).json({ success: true, track: data })
    } catch (error) {
        console.error("Error adding track to playlist:", error.message)
        return res.status(500).json({ message: "Error adding track to playlist" })
    }
}

export async function removeTrackFromPlaylist(req, res) {
    const { id: playlistId, trackId } = req.params

    if (!playlistId || !trackId) {
        return res.status(400).json({ message: "Playlist ID and Track ID are required" })
    }

    try {
        // 1️⃣ Validate playlist ownership
        const { data: playlist, error: playlistError } = await supabase
            .from("playlists")
            .select("id, tracks_count")
            .eq("id", playlistId)
            .eq("user_id", req.user.id)
            .single()

        if (playlistError || !playlist) {
            return res.status(404).json({ message: "Playlist not found" })
        }

        // 2️⃣ Fetch position of the track being removed
        const { data: trackRow, error: trackRowError } = await supabase
            .from("playlist_tracks")
            .select("position")
            .eq("playlist_id", playlistId)
            .eq("track_id", trackId)
            .single()

        if (trackRowError || !trackRow) {
            return res.status(404).json({ message: "Track not found in playlist" })
        }

        const removedPosition = trackRow.position

        // 3️⃣ Delete the track
        const { error: deleteError } = await supabase
            .from("playlist_tracks")
            .delete()
            .eq("playlist_id", playlistId)
            .eq("track_id", trackId)

        if (deleteError) {
            return res.status(500).json({ message: "Failed to remove track" })
        }

        // 4️⃣ Compact positions
        const { error: shiftError } = await supabase.rpc(
            "shift_playlist_positions",
            {
                playlist_id_param: playlistId,
                removed_position_param: removedPosition
            }
        )


        if (shiftError) {
            return res.status(500).json({ message: "Failed to reorder playlist" })
        }

        const { error: tracksCountUpdateError } = await supabase
            .from("playlists")
            .update({ tracks_count: (playlist.tracks_count || 0) - 1 })
            .eq("id", playlist.id)

        if (tracksCountUpdateError) {
            console.error("Error updating tracks count:", tracksCountUpdateError)
            return res.status(500).json({ message: "DB error: updating tracks count.", code: tracksCountUpdateError.code })
        }

        return res.status(200).json({
            success: true,
            message: "Track removed and playlist reordered"
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}
