import apiClient from "./client"

export async function fetchPodcastCollections() {
    const {data} = await apiClient.get(`/podcasts/collections`)
    if (data.success) return data.podcastCollections
    return []
}

export async function fetchPodcastEpisodes(collectionId) {
    const {data} = await apiClient.get(`/podcasts/${collectionId}/episodes`)
    if (data.success) return data.podcastEpisodes
    return []
}

export async function fetchAPodcast(collectionId) {
    const {data} = await apiClient.get(`/podcasts/${collectionId}`)
    if (data.success) return data.podcast
    return null
}