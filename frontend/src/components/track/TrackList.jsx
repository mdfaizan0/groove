import { usePlaylists } from "@/hooks/playlists/usePlaylists"
import TrackCard from "./TrackCard"

const TrackList = ({ tracks }) => {
    const { playlists, loading, refetch } = usePlaylists()
    if (!tracks.length) {
        return (
            <p className="text-sm text-muted-foreground">
                No tracks available.
            </p>
        )
    }
    return (
        <div className="grid gap-4">
            {tracks.map(track => (
                <TrackCard key={track.id} track={track} playlists={playlists} loading={loading} refetch={refetch} />
            ))}
        </div>
    )
}

export default TrackList