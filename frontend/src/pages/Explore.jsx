import Loading from "@/components/Loading";
import CategoryFilter from "@/components/track/CategoryFilter";
import TrackList from "@/components/track/TrackList";
import { useTracks } from "@/hooks/tracks/useTracks";

const Explore = () => {
    const { filteredTracks, loading, error, categories, selectedCategoryId, setSelectedCategoryId } = useTracks();

    if (loading) return <Loading />
    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <p className="text-destructive font-medium text-lg">Failed to load discoveries</p>
            <p className="text-sm text-muted-foreground">{error}</p>
        </div>
    )

    return (
        <div className="mx-auto max-w-7xl px-8 py-10 space-y-10 animate-in fade-in duration-700">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-white">Explore</h1>
                <p className="text-muted-foreground text-sm font-medium">Discover new sounds and genres across our library.</p>
            </div>

            <div className="sticky top-0 z-20 pb-4 bg-background/80 backdrop-blur-md">
                <CategoryFilter
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    setSelectedCategoryId={setSelectedCategoryId}
                />
            </div>

            <div className="grid gap-2">
                <TrackList tracks={filteredTracks} />
            </div>

            {filteredTracks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-card/10 rounded-3xl border border-dashed border-white/5">
                    <p className="text-muted-foreground italic">No tracks found in this category.</p>
                </div>
            )}
        </div>
    )
}

export default Explore
