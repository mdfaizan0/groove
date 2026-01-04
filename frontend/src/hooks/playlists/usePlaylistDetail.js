import { fetchPlaylistTracks } from "@/api/playlists.api"
import { useCallback, useEffect, useState } from "react"

export function usePlaylistDetail(playlistId) {
    const [tracks, setTracks] = useState([])
    const [playlist, setPlaylist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadData = useCallback(async () => {
        try {
            setLoading(true)
            const data = await fetchPlaylistTracks(playlistId)
            setTracks(data.tracks)
            setPlaylist(data.playlist)
        } catch (error) {
            setError(error || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }, [playlistId])

    useEffect(() => {
        loadData()
    }, [loadData])

    return { tracks, playlist, loading, error, refetch: loadData }
}