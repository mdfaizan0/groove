import { fetchPlaylistTracks } from "@/api/playlists.api"
import { useEffect, useState } from "react"

export function usePlaylistDetail(playlistId) {
    const [tracks, setTracks] = useState([])
    const [playlist, setPlaylist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function loadData() {
        try {
            setLoading(true) // Moved here to ensure loading state is set on refetch
            const data = await fetchPlaylistTracks(playlistId)
            setTracks(data.tracks)
            setPlaylist(data.playlist)
        } catch (error) {
            setError(error || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [playlistId])

    return { tracks, playlist, loading, error, refetch: loadData }
}