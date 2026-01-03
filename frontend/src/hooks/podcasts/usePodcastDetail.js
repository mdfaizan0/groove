import { fetchAPodcast } from "@/api/podcasts.api"
import { useEffect, useState } from "react"

export function usePodcastDetail(collectionId) {
    const [podcast, setPodcast] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        let isMounted = true
        
        async function loadData() {
            try {
                const data = await fetchAPodcast(collectionId)

                if (!isMounted) return

                setPodcast(data)
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

    return { podcast, loading, error }
}