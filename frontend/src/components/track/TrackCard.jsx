import { useAudio } from "@/context/audio/useAudio"
import { ListPlus, Play } from "lucide-react"
import { useState } from "react"
import AddToPlaylistDialog from "../playlists/AddToPlaylistDialog"
import { Button } from "@/components/ui/button"

const TrackCard = ({ track, variant = "horizontal", playlists, loading, refetch }) => {
    const { playTrack, currentTrack, isPlaying } = useAudio()
    const [open, setOpen] = useState(false)

    const isCurrent = currentTrack?.id === track.id
    const isActuallyPlaying = isCurrent && isPlaying

    if (variant === "vertical") {
        return (
            <>
                <div
                    className="group relative flex flex-col gap-3 p-4 rounded-2xl bg-card/40 border border-white/5 hover:bg-white/10 transition-all duration-500 cursor-pointer overflow-hidden animate-in fade-in zoom-in-95"
                    onClick={() => playTrack(track)}
                >
                    {/* Cover Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-xl">
                        <img
                            src={track.cover_image_path || `https://api.dicebear.com/7.x/initials/svg?seed=${track.title}`}
                            alt={track.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${isActuallyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-lg">
                                <Play size={24} fill="currentColor" className={`text-primary-foreground ${isActuallyPlaying ? 'animate-pulse' : 'ml-1'}`} />
                            </div>
                        </div>
                        {isCurrent && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-sm" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <h2 className={`text-sm font-bold truncate transition-colors ${isCurrent ? 'text-primary' : 'text-white'}`}>
                            {track.title}
                        </h2>
                        <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                            {track.artist}
                        </p>
                    </div>

                    {/* Hover actions */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md hover:bg-primary hover:text-white transition-all shadow-lg"
                            onClick={(e) => { e.stopPropagation(); setOpen(true) }}
                        >
                            <ListPlus size={16} />
                        </Button>
                    </div>

                    {/* Decorative background blur */}
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                </div>
                <AddToPlaylistDialog
                    open={open}
                    onOpenChange={setOpen}
                    trackId={track.id}
                    playlists={playlists}
                    loading={loading}
                    refetch={refetch}
                />
            </>
        )
    }

    return (
        <>
            <div
                className={`group relative flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-card/40 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden ${isCurrent ? 'ring-2 ring-primary/50 bg-primary/10' : ''}`}
                onClick={() => playTrack(track)}
            >
                {/* Track Cover / Play Overlay */}
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-muted/20">
                    <img
                        src={track.cover_image_path || `https://api.dicebear.com/7.x/initials/svg?seed=${track.title}`}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isActuallyPlaying || isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isActuallyPlaying ? (
                            <div className="flex items-end gap-1 h-3 mb-1">
                                <div className="w-0.5 h-full bg-primary animate-bounce" />
                                <div className="w-0.5 h-2 bg-primary animate-bounce delay-75" />
                                <div className="w-0.5 h-full bg-primary animate-bounce delay-150" />
                            </div>
                        ) : (
                            <Play size={20} fill="currentColor" className="text-white ml-0.5" />
                        )}
                    </div>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                    <h3 className={`text-sm font-semibold truncate ${isCurrent ? 'text-primary' : 'text-white'}`}>
                        {track.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {track.artist}
                    </p>
                </div>

                <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
                        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
                    >
                        <ListPlus size={16} />
                    </Button>
                </div>

                {/* Subtle highlight gradient */}
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <AddToPlaylistDialog
                open={open}
                onOpenChange={setOpen}
                trackId={track.id}
                playlists={playlists}
                loading={loading}
                refetch={refetch}
            />
        </>
    )
}

export default TrackCard