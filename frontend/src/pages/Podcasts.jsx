import Loading from "@/components/Loading"
import PodcastCard from "@/components/podcast/PodcastCard"
import { usePodcasts } from "@/hooks/podcasts/usePodcasts"

const Podcasts = () => {
    const { podcasts, loading, error } = usePodcasts()

    if (loading) return <Loading />
    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <p className="text-destructive font-medium">Error loading podcasts</p>
            <p className="text-sm text-muted-foreground">{error}</p>
        </div>
    )

    if (!podcasts.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <h2 className="text-xl font-bold text-white mb-2">No Podcasts Found</h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                    We couldn't find any podcasts. Please check back later for fresh content.
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-8 py-10 space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Discover Podcasts
                </h1>
                <p className="text-muted-foreground text-lg">
                    Dive into stories, knowledge, and entertainment.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {podcasts.map(podcast => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
            </div>
        </div>
    )
}

export default Podcasts