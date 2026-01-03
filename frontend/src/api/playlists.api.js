import { getToken } from "@/auth/authActions"
import apiClient from "./client"


export async function fetchPlaylists() {
    const token = getToken()
    const { data } = await apiClient.get(`/playlists`, { headers: { Authorization: `Bearer ${token}` } })
    if (data.success) return data.playlists
    return []
}

export async function fetchPlaylistTracks(playlistId) {
    const token = getToken()
    const { data } = await apiClient.get(`/playlists/${playlistId}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!data.success) throw new Error("Failed to fetch playlist")
    return { playlist: data.playlist, tracks: data.tracks }
}

export async function createPlaylist(playlistData) {
    const token = getToken()
    const { data } = await apiClient.post(`/playlists`, playlistData, { headers: { Authorization: `Bearer ${token}` } })
    if (data.success) return data.playlist
}

export async function updatePlaylist(playlistId, playlistData) {
    const token = getToken()
    const { data } = await apiClient.patch(`/playlists/${playlistId}`, playlistData, { headers: { Authorization: `Bearer ${token}` } })
    if (data.success) return data.playlist
    return null
}

export async function removePlaylist(playlistId) {
    const token = getToken()
    const { data } = await apiClient.delete(`/playlists/${playlistId}`, { headers: { Authorization: `Bearer ${token}` } })
    if (data.success) return data.playlist
    return null
}

export async function addTrackToPlaylist(playlistId, trackId) {
    const token = getToken()
    const { data } = await apiClient.post(`/playlists/${playlistId}`, { trackId }, { headers: { Authorization: `Bearer ${token}` } })
    if (data.success) return data.track
    return null
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
    const token = getToken()
    const { data } = await apiClient.delete(`/playlists/${playlistId}/${trackId}`, { headers: { Authorization: `Bearer ${token}` } })
    if (data.success) return data.message
    return null
}