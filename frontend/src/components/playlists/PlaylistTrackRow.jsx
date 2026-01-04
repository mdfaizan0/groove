import { useAudio } from "@/context/audio/useAudio"
import { removeTrackFromPlaylist } from "@/api/playlists.api"
import { Trash2, Play, Pause } from "lucide-react"
import { toast } from "sonner"

function formatTime(seconds = 0) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

const PlaylistTrackRow = ({ track, index, playlistId, refetch }) => {
    const { playTrack, currentTrack, isPlaying, pauseTrack } = useAudio()
    const isCurrent = currentTrack?.id === track.id

    const handleRemove = async (e) => {
        e.stopPropagation()
        try {
            await removeTrackFromPlaylist(playlistId, track.id)
            toast.success("Track removed from playlist")
            await refetch()
        } catch {
            toast.error("Failed to remove track")
        }
    }

    const handlePlay = (e) => {
        e.stopPropagation()
        if (isCurrent && isPlaying) {
            pauseTrack()
        } else {
            playTrack(track)
        }
    }

    return (
        <div
            className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer ${isCurrent ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/40 border border-transparent"
                }`}
            onClick={handlePlay}
        >
            {/* Position / Play Icon */}
            <div className="w-8 flex items-center justify-center text-sm font-mono text-muted-foreground">
                {isCurrent && isPlaying ? (
                    <Pause size={16} className="text-primary fill-primary" />
                ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                )}
                <Play size={16} className={`hidden group-hover:block transition-all ${isCurrent ? "text-primary" : ""}`} />
            </div>

            {/* Cover Art */}
            <img
                src={track.cover_image_path}
                alt={track.title}
                className="w-12 h-12 rounded-lg object-cover shadow-sm"
            />

            {/* Track Info */}
            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold truncate ${isCurrent ? "text-primary" : ""}`}>
                    {track.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>

            {/* Duration */}
            <div className="text-xs font-mono text-muted-foreground w-12 text-right">
                {formatTime(track.duration)}
            </div>

            {/* Remove Action */}
            <button
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
                title="Remove from playlist"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}

export default PlaylistTrackRow