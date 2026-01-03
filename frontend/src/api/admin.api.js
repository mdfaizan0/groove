import { getToken } from "@/auth/authActions";
import apiClient from "./client";

const getHeaders = () => {
    const token = getToken();
    return {
        Authorization: `Bearer ${token}`,
    };
};

// CATEGORIES
export async function createCategory(categoryData) {
    const { data } = await apiClient.post("/admin/categories", categoryData, { headers: getHeaders() });
    return data;
}

export async function updateCategory(id, categoryData) {
    const { data } = await apiClient.patch(`/admin/categories/${id}`, categoryData, { headers: getHeaders() });
    return data;
}

export async function deleteCategory(id) {
    const { data } = await apiClient.delete(`/admin/categories/${id}`, { headers: getHeaders() });
    return data;
}

// TRACKS
export async function createTrack(formData) {
    const { data } = await apiClient.post("/admin/tracks", formData, {
        headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

// PODCAST COLLECTIONS
export async function createPodcastCollection(formData) {
    const { data } = await apiClient.post("/admin/podcasts", formData, {
        headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

// PODCAST EPISODES
export async function createPodcastEpisode(formData) {
    const { data } = await apiClient.post("/admin/podcast-episodes", formData, {
        headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}
