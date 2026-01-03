import { fetchPodcastCollections } from "@/api/podcasts.api"
import { useEffect, useState } from "react"

export function usePodcasts() {
    const [podcasts, setPodcasts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isMounted = true

        async function loadData() {
            try {
                const data = await fetchPodcastCollections()

                if (!isMounted) return

                setPodcasts(data)
            } catch (error) {
                if (!isMounted) return
                setError(error || "Something went wrong")
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadData()

        return () => {
            isMounted = false
        }
    }, [])

    return { podcasts, loading, error }
}