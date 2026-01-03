import { useAudio } from "@/context/audio/useAudio"
import { Play, Clock, Calendar } from "lucide-react"

const PodcastEpisode = ({ episode, podcast, index }) => {
    const { playTrack, currentTrack, isPlaying } = useAudio()
    const newEpisode = { ...episode, podcast: { ...podcast } }

    const isCurrent = currentTrack?.id === episode.id
    const isActuallyPlaying = isCurrent && isPlaying

    // Formatting helpers
    const formatDuration = (seconds) => {
        if (!seconds) return "00:00"
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = Math.floor(seconds % 60)
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ""
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div
            className={`group relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${isCurrent
                    ? 'bg-primary/10 border-primary/20 shadow-lg'
                    : 'bg-card/40 border-white/5 hover:bg-white/10 hover:border-white/10'
                }`}
            onClick={() => playTrack(newEpisode)}
        >
            {/* Play Button - Fixed size to prevent squeezing */}
            <div className="relative shrink-0 flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCurrent ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}>
                    <Play size={22} fill="currentColor" className={isActuallyPlaying ? "animate-pulse" : "ml-1"} />
                </div>

                {/* Micro index indicator */}
                <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-background border border-white/10 flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                    {index}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col min-w-0 flex-1 gap-1">
                <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold truncate transition-colors ${isCurrent ? 'text-primary' : 'text-white'}`}>
                        {episode.title}
                    </h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {episode.description}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="opacity-50" />
                        <span>{formatDate(episode.published_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={12} className="opacity-50" />
                        <span>{formatDuration(episode.duration)}</span>
                    </div>
                    {isCurrent && (
                        <div className="flex items-center gap-1 text-primary">
                            <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            <span>Playing</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Subtle side highlight */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-all duration-500 ${isCurrent ? 'scale-y-100' : 'scale-y-0'}`} />
        </div>
    )
}

export default PodcastEpisode