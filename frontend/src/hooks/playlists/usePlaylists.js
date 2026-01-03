import { fetchPlaylists } from "@/api/playlists.api"
import { useEffect, useState } from "react"

export function usePlaylists({ enabled = true } = {}) {
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(enabled)
    const [error, setError] = useState(null)

    async function loadData() {
        try {
            setLoading(true)
            const data = await fetchPlaylists()
            setPlaylists(data)
            setError(null)
        } catch (error) {
            setError(error || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (enabled) {
            loadData()
        }
    }, [enabled])

    return { playlists, loading, error, refetch: loadData }
}