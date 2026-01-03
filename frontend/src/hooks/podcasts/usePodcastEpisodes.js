import { fetchPodcastEpisodes } from "@/api/podcasts.api"
import { useEffect, useState } from "react"

export function usePodcastEpisodes(collectionId) {
    const [episodes, setEpisodes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isMounted = true

        async function loadData() {
            try {
                const data = await fetchPodcastEpisodes(collectionId)

                if (!isMounted) return

                setEpisodes(data)
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
    }, [collectionId])

    return { episodes, loading, error }
}