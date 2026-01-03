import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ListPlus, Loader2Icon, Plus } from "lucide-react"
import { addTrackToPlaylist, createPlaylist } from "@/api/playlists.api"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { useState } from "react"

const AddToPlaylistDialog = ({ trackId, open, onOpenChange, playlists, loading, refetch }) => {
  const [name, setName] = useState("")
  const [creating, setCreating] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    if (creating) return
    const trimmedName = name.trim()
    if (trimmedName.length < 3 || trimmedName.length > 60) {
      toast.error("Playlist name should be 3-60 characters long.")
      return
    }

    try {
      setCreating(true)
      await createPlaylist({ name: trimmedName })
      toast.success("Playlist created!")
      setName("")
      await refetch()
    } catch (error) {
      toast.error("Playlist creation failed")
      console.error("Playlist creation failed", error)
    } finally {
      setCreating(false)
    }
  }

  const addToPlaylist = async (playlistId) => {
    try {
      const data = await addTrackToPlaylist(playlistId, trackId)
      if (data) {
        onOpenChange(false)
        toast.success("Track added to playlist")
      }
    } catch (error) {
      toast.error("Failed to add track to playlist")
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[550px] flex flex-col p-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle>Add to playlist</DialogTitle>
            <DialogDescription>
              Add this track to your playlist
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-2">
              {playlists?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No playlists found</p>
                </div>
              ) : (
                playlists?.map(playlist => (
                  <div
                    key={playlist.id}
                    className="flex justify-between items-center bg-muted/40 hover:bg-muted/80 p-4 rounded-xl transition-all duration-300"
                  >
                    <div>
                      <h3 className="font-semibold">{playlist.name}</h3>
                      <p className="text-xs text-muted-foreground">{playlist.tracks_count} tracks</p>
                    </div>
                    <button
                      className="flex items-center p-2.5 rounded-full bg-background border border-border hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300 cursor-pointer"
                      onClick={() => addToPlaylist(playlist.id)}
                    >
                      <ListPlus size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-6 pt-2 border-t bg-muted/20">
          <form onSubmit={handleCreate} className="flex items-center gap-2">
            <Input
              variant="outline"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New playlist name"
              className="flex-1 bg-background"
            />
            <button
              type="submit"
              disabled={creating}
              className="flex items-center justify-center min-w-[44px] h-[44px] rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {creating ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                <Plus size={20} />
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddToPlaylistDialog