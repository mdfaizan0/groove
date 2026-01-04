import { Pencil, TrashIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updatePlaylist } from "@/api/playlists.api"
import { toast } from "sonner"

const PlaylistCard = ({ playlist, handleDelete, refetch }) => {
    const navigate = useNavigate()
    const [editOpen, setEditOpen] = useState(false)
    const [editName, setEditName] = useState(playlist.name)
    const [updating, setUpdating] = useState(false)

    const handleEdit = async (e) => {
        e.preventDefault()
        if (updating) return

        const trimmedName = editName.trim()
        if (trimmedName.length < 3 || trimmedName.length > 60) {
            toast.error("Playlist name should be 3-60 characters long.")
            return
        }

        try {
            setUpdating(true)
            await updatePlaylist(playlist.id, { name: trimmedName })
            toast.success("Playlist updated!")
            setEditOpen(false)
            if (refetch) await refetch()
        } catch (error) {
            console.error("Playlist update failed:", error)
            toast.error("Failed to update playlist")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div
            className="flex justify-between items-center rounded-lg border bg-card p-4 hover:bg-muted/40 transition cursor-pointer"
            onClick={() => navigate(`/playlists/${playlist.id}`)}
        >
            <div>
                <h3 className="text-lg font-medium">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground">{playlist.tracks_count} tracks</p>
            </div>
            <div className="flex flex-row gap-2">
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setEditName(playlist.name)
                            }}
                            className="flex items-center p-2 rounded-full bg-muted 
                            cursor-pointer border border-primary/20 hover:bg-primary/40 hover:text-primary transition-colors duration-300"
                        >
                            <Pencil size={16} />
                        </button>
                    </DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                            <DialogTitle>Edit Playlist</DialogTitle>
                            <DialogDescription>
                                Update the name of your playlist.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit}>
                            <div className="grid gap-4 py-4">
                                <Input
                                    id="name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Playlist name"
                                    disabled={updating}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditOpen(false)}
                                    disabled={updating}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updating}>
                                    {updating ? "Saving..." : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            onClick={(e) => { e.stopPropagation() }}
                            className="flex items-center p-2 rounded-full bg-muted 
                                    cursor-pointer border border-primary/20 hover:bg-destructive/40 hover:text-destructive transition-colors duration-300"
                        >
                            <TrashIcon size={16} />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the playlist "{playlist.name}" and remove all tracks from it.
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-accent hover:text-accent-foreground">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(playlist)
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default PlaylistCard