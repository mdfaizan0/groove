import { useAudio } from "@/context/audio/useAudio"
import { usePlaylists } from "@/hooks/playlists/usePlaylists"
import {
    Pause,
    Play,
    Plus,
    RotateCcw,
    Rewind,
    FastForward,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Loader2
} from "lucide-react"
import AddToPlaylistDialog from "./playlists/AddToPlaylistDialog"
import { useState } from "react"

function formatTime(seconds = 0) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

const MiniPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playTrack,
        pauseTrack,
        seek,
        volume,
        muted,
        isLoading,
        changeVolume,
        // 🔴 Play-Playlist 🔴
        toggleMuted,
        playlist,
        currentIndex,
        playNext,
        playPrevious
        // 🔴 Play-Playlist 🔴
    } = useAudio()
    const [open, setOpen] = useState(false)

    const isMusicTrack = !!currentTrack && !currentTrack.podcast
    const { playlists, loading, refetch } = usePlaylists({ enabled: isMusicTrack })

    const progress = duration ? (currentTime / duration) * 100 : 0

    if (!currentTrack) return null
    return (
        <div className="h-24 bg-background/60 backdrop-blur-sm border-t border-border/50 px-6 flex items-center justify-between gap-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">

            {/* Left: Track Info */}
            <div className="flex items-center gap-4 w-[30%] min-w-0">
                <div className={`relative group shrink-0 border border-primary/50 ${isPlaying && !isLoading ? "animate-spin animation-duration-[5s]" : ""}`}>
                    <img
                        src={currentTrack.cover_image_path || currentTrack.podcast.cover_image_url || ""}
                        alt={currentTrack.title}
                        className="w-14 h-14 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-foreground/10" />

                    {/* Loading overlay on Art */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] rounded-full flex items-center justify-center">
                            <Loader2 size={16} className="text-primary animate-spin" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold truncate hover:underline cursor-default" title={currentTrack.title || currentTrack.trackName}>
                        {currentTrack.title || currentTrack.trackName}
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                        {currentTrack.artist || currentTrack.podcast.title || "Unknown Artist"}
                    </p>
                </div>
            </div>

            {/* Center: Playback Controls & Seek */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
                <div className="flex items-center gap-6">
                    {/* 🔴 Play-Playlist 🔴 */}
                    <button
                        onClick={playPrevious}
                        disabled={playlist.length === 0 || currentIndex <= 0}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Previous Track"
                    >
                        <SkipBack size={20} fill="currentColor" fillOpacity={0.1} />
                    </button>
                    {/* 🔴 Play-Playlist 🔴 */}
                    <button
                        onClick={() => { seek(0); playTrack(currentTrack) }}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        title="Replay"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={() => seek(Math.max(0, currentTime - 15))}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Back 15s"
                    >
                        <Rewind size={22} fill="currentColor" fillOpacity={0.1} />
                    </button>
                    <button
                        className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => isPlaying ? pauseTrack() : playTrack(currentTrack)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={20} fill="currentColor" />
                        ) : (
                            <Play size={20} fill="currentColor" className="ml-1" />
                        )}
                    </button>
                    <button
                        onClick={() => seek(Math.min(duration, currentTime + 15))}
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Forward 15s"
                    >
                        <FastForward size={22} fill="currentColor" fillOpacity={0.1} />
                    </button>
                    {/* 🔴 Play-Playlist 🔴 */}
                    <button
                        onClick={playNext}
                        disabled={playlist.length === 0 || currentIndex >= playlist.length - 1}
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Next Track"
                    >
                        <SkipForward size={20} fill="currentColor" fillOpacity={0.1} />
                    </button>
                    {/* 🔴 Play-Playlist 🔴 */}
                    {isMusicTrack && <button
                        className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        onClick={() => setOpen(true)}
                        title="Add to Playlist"
                    >
                        <Plus size={22} />
                    </button>}
                </div>

                <div className="w-full flex items-center gap-3">
                    <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-10 text-right">
                        {formatTime(currentTime)}
                    </span>
                    <div className="flex-1 relative h-6 flex items-center group">
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            value={currentTime || 0}
                            onChange={(e) => seek(Number(e.target.value))}
                            className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary group-hover:h-1.5 transition-all"
                            style={{
                                background: `linear-gradient(to right, var(--primary) ${progress}%, var(--muted) ${progress}%)`
                            }}
                        />
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-10">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Right: Volume Controls */}
            <div className="flex items-center justify-end gap-3 w-[30%]">
                <button
                    onClick={toggleMuted}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="w-24 group flex items-center h-6">
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={muted ? 0 : volume}
                        onChange={(e) => changeVolume(Number(e.target.value))}
                        className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer accent-primary group-hover:h-1.5 transition-all"
                        style={{
                            background: `linear-gradient(to right, var(--primary) ${(muted ? 0 : volume) * 100}%, var(--muted) ${(muted ? 0 : volume) * 100}%)`
                        }}
                    />
                </div>
            </div>

            {isMusicTrack && <AddToPlaylistDialog
                trackId={currentTrack.id}
                open={open}
                onOpenChange={setOpen}
                playlists={playlists}
                loading={loading}
                refetch={refetch}
            />}
        </div>
    )
}

export default MiniPlayer