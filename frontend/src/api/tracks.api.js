import apiClient from "./client";

export async function fetchTracks() {
    const { data } = await apiClient.get("/tracks");
    if (data.success) return data.tracks;
    return [];
}