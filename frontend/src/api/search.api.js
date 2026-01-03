import apiClient from "./client";

export async function searchAll(query) {
    try {
        const response = await apiClient.get(`/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Search API error:", error);
        throw error;
    }
}
