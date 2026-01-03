import { getToken } from "@/auth/authActions";
import apiClient from "./client";

export async function fetchRecentlyPlayed() {
    const token = getToken();
    const { data } = await apiClient.get("/recently-played", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (data.success) return data.tracks;
    return [];
}

export async function saveRecentlyPlayed(trackId, lastPosition) {
    const token = getToken();
    if (!token) return; // Silent fail if not logged in

    try {
        const { data } = await apiClient.post(
            "/recently-played",
            { trackId, lastPosition },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return data.success;
    } catch (error) {
        console.error("Failed to save recently played:", error);
        return false;
    }
}
