import { fetchRecentlyPlayed } from "@/api/recentlyPlayed.api";
import { useAuth } from "@/context/auth/useAuth";
import { useEffect, useState } from "react";

export function useRecentlyPlayed() {
    const { user } = useAuth();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function loadData() {
        if (!user) {
            setTracks([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await fetchRecentlyPlayed();
            setTracks(data);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [user]);

    return { tracks, loading, error, refetch: loadData };
}
