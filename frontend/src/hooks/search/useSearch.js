import { useState, useEffect } from "react";
import { searchAll } from "../../api/search.api";

export function useSearch(query) {
    const [tracks, setTracks] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setTracks([]);
            setEpisodes([]);
            setLoading(false);
            return;
        }

        // Set loading true immediately for instant feedback
        setLoading(true);

        const debounceTimer = setTimeout(async () => {
            try {
                const results = await searchAll(query);
                setTracks(results.tracks || []);
                setEpisodes(results.episodes || []);
            } catch (error) {
                console.error("Search error in hook:", error);
            } finally {
                setLoading(false);
            }
        }, 400); // Debounce duration: 400ms

        return () => clearTimeout(debounceTimer);
    }, [query]);

    return { tracks, episodes, loading };
}
