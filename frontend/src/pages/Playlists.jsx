import { createPlaylist, removePlaylist } from "@/api/playlists.api"
import Loading from "@/components/Loading"
import PlaylistCard from "@/components/playlists/PlaylistCard"
import { usePlaylists } from "@/hooks/playlists/usePlaylists"
import { useState } from "react"

const Playlists = () => {
    const { playlists, loading, error, refetch } = usePlaylists()
    const [name, setName] = useState("")
    const [creating, setCreating] = useState(false)

    async function handleCreate(e) {
        e.preventDefault()
        if (creating) return
        const trimmedName = name.trim()
        if (trimmedName.length < 3 || trimmedName.length > 60) {
            alert("Playlist name should be 3-60 characters long.")
            return
        }

        try {
            setCreating(true)
            await createPlaylist({ name: trimmedName })
            alert("Playlist created!")
            setName("")
            await refetch()
        } catch (error) {
            console.error("Playlist creation failed:", error)
        } finally {
            setCreating(false)
        }
    }

    async function handleDelete(playlist) {
        const shouldDelete = confirm(`Are you sure you want to delete ${playlist.name}?`)
        if (!shouldDelete) return

        try {
            await removePlaylist(playlist.id)
            alert("Playlist deleted!")
            await refetch()
        } catch (error) {
            console.error("Failed to delete playlist:", error)
        }
    }

    if (loading) return <Loading />
    if (error) return <div>Error: {error}</div>
    return (
        <div className="space-y-6">
            <h1 className="font-bold text-2xl">Playlists</h1>

            {/* Playlist create */}
            <form className="flex gap-2 max-w-md" onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Enter playlist name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                    disabled={creating}
                />
                <button
                    type="submit"
                    disabled={creating}
                    className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50 cursor-pointer hover:bg-accent transition-colors duration-300"
                >
                    {creating ? "Creating..." : "Create"}
                </button>
            </form>

            {/* List */}
            <ul className="space-y-3">
                {playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} handleDelete={handleDelete} />
                ))}
            </ul>
        </div>
    )
}

export default Playlists