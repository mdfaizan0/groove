import Loading from "@/components/Loading"
import { usePlaylistDetail } from "@/hooks/playlists/usePlaylistDetail"
import { useParams } from "react-router-dom"
import PlaylistTrackRow from "@/components/playlists/PlaylistTrackRow"

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const { tracks, playlist, loading, error, refetch } = usePlaylistDetail(playlistId)

  if (loading) return <Loading />
  if (error) return <div>Error: {error}</div>

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {playlist?.name || "Playlist"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {playlist?.tracks_count || 0} tracks • Created by you
        </p>
      </div>

      {/* Tracks List */}
      <div className="flex flex-col gap-1 max-w-6xl">
        {tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">No tracks found in this playlist</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {tracks.map((track, index) => (
              <PlaylistTrackRow
                key={track.id}
                track={track}
                index={index}
                playlistId={playlistId}
                refetch={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistDetail