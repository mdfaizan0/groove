import { Pencil, TrashIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

const PlaylistCard = ({ playlist, handleDelete }) => {
    const navigate = useNavigate()

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
                <button
                    onClick={(e) => { e.stopPropagation() }}
                    className="flex items-center p-2 rounded-full bg-muted 
                    cursor-pointer border border-primary/20 hover:bg-primary/40 hover:text-primary transition-colors duration-300"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(playlist) }}
                    className="flex items-center p-2 rounded-full bg-muted 
                            cursor-pointer border border-primary/20 hover:bg-destructive/40 hover:text-destructive transition-colors duration-300"
                >
                    <TrashIcon size={16} />
                </button>
            </div>
        </div>
    )
}

export default PlaylistCard