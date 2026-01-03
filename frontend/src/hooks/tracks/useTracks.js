import { fetchCategories } from "@/api/categories.api";
import { fetchTracks } from "@/api/tracks.api";
import { useEffect, useMemo, useState } from "react";

export function useTracks() {
    const [tracks, setTracks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const [tracks, categories] = await Promise.all([fetchTracks(), fetchCategories()])

                if (!isMounted) return

                setTracks(tracks)
                setCategories(categories)
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

    const filteredTracks = useMemo(() => {
        if (!tracks) return []
        if (!selectedCategoryId) return tracks
        return tracks.filter(track => track.category_id === selectedCategoryId)
    }, [tracks, selectedCategoryId])

    return { tracks, categories, loading, error, filteredTracks, setSelectedCategoryId, selectedCategoryId }
}