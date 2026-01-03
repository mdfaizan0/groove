import { useParams, useNavigate } from "react-router-dom"
import Loading from "@/components/Loading"
import PodcastEpisode from "@/components/podcast/PodcastEpisode"
import { usePodcastDetail } from "@/hooks/podcasts/usePodcastDetail"
import { usePodcastEpisodes } from "@/hooks/podcasts/usePodcastEpisodes"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const PodcastDetail = () => {
    const { collectionId } = useParams()
    const navigate = useNavigate()
    const { podcast, loading, error } = usePodcastDetail(collectionId)
    const { episodes, loading: episodesLoading, error: episodesError } = usePodcastEpisodes(collectionId)

    if (loading || episodesLoading) return <Loading />
    if (error || episodesError) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <p className="text-destructive font-medium">Error loading podcast details</p>
            <p className="text-sm text-muted-foreground">{error || episodesError}</p>
        </div>
    )

    if (!podcast) return null

    // Sort episodes by latest first
    const sortedEpisodes = [...episodes].sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))

    return (
        <div className="relative min-h-full pb-20 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="relative flex flex-col items-center pt-8 md:pt-12">
                {/* Backdrop backdrop-blur-3xl for cozy feel */}
                <div className="absolute inset-x-0 top-0 h-[500px] overflow-hidden -z-10">
                    <img src={podcast.cover_image_url} alt="" className="w-full h-full object-cover blur-[100px] opacity-20" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background" />
                </div>

                <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Compact, Rounded Cover Art */}
                    <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                        <img
                            src={podcast.cover_image_url}
                            alt={podcast.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-4 text-center md:text-left flex-1 py-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">Podcast</span>
                            <span className="text-muted-foreground text-xs">• {episodes.length} Episodes</span>
                            {podcast.explicit && <span className="px-1.5 py-0.5 rounded-sm border border-muted-foreground/30 text-muted-foreground text-[9px] uppercase">Explicit</span>}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                            {podcast.title}
                        </h1>

                        <div className="max-w-2xl">
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                {podcast.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Button - Floating */}
                {/* Back Button - Absolute to prevent overlap with sidebar */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-8 left-8 z-50 bg-card/40 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:text-white rounded-xl h-12 w-12 shadow-xl transition-all hover:-translate-x-1"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={20} />
                </Button>
            </div>

            {/* Episodes List */}
            <div className="max-w-4xl mx-auto px-6 mt-16 md:mt-20">
                <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
                    <div className="space-y-1">
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            Episodes
                        </h2>
                        <p className="text-xs text-muted-foreground">Showing newest first</p>
                    </div>
                    <div className="w-8 h-1 rounded-full bg-primary" />
                </div>

                {!sortedEpisodes.length ? (
                    <div className="bg-card/20 border border-white/5 rounded-3xl p-16 text-center">
                        <p className="text-muted-foreground italic text-sm">No episodes available.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {sortedEpisodes.map((episode, index) => (
                            <PodcastEpisode
                                key={episode.id}
                                episode={episode}
                                podcast={podcast}
                                index={sortedEpisodes.length - index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PodcastDetail