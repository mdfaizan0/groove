import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/hooks/search/useSearch";
import TrackCard from "@/components/track/TrackCard";
import PodcastEpisode from "@/components/podcast/PodcastEpisode";
import Loading from "@/components/Loading";

const Search = () => {
    const [query, setQuery] = useState("");
    const { tracks, episodes, loading } = useSearch(query);

    return (
        <div className="mx-auto max-w-7xl px-8 py-10 space-y-10 animate-in fade-in duration-700">
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search for songs or podcast episodes..."
                    className="w-full bg-card/40 border border-white/5 rounded-full py-4 pl-14 pr-8 outline-hidden focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-base font-medium shadow-2xl"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loading />
                    <p className="mt-4 text-sm text-muted-foreground animate-pulse font-medium">Scouring the library...</p>
                </div>
            )}

            {!loading && !query.trim() && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/40">
                        <SearchIcon className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white tracking-tight">Ready to Discover?</h2>
                        <p className="text-sm text-muted-foreground max-w-xs font-medium leading-relaxed">
                            Find your favorite tracks and deep-dive into podcast episodes from across Groove.
                        </p>
                    </div>
                </div>
            )}

            {!loading && query.trim() && tracks.length === 0 && episodes.length === 0 && (
                <div className="text-center py-20 bg-card/10 rounded-4xl border border-dashed border-white/5 mx-auto max-w-2xl">
                    <h2 className="text-xl font-bold text-white">No results for "{query}"</h2>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">Maybe try a different keyword or check for typos?</p>
                </div>
            )}

            {!loading && query.trim() && (tracks.length > 0 || episodes.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">

                    {/* Tracks Section */}
                    {tracks.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-black tracking-tight text-white">Songs</h2>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                                    {tracks.length} results
                                </span>
                            </div>
                            <div className="grid gap-3">
                                {tracks.map(track => (
                                    <TrackCard key={track.id} track={track} variant="horizontal" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Episodes Section */}
                    {episodes.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h2 className="text-2xl font-black tracking-tight text-white">Podcast Episodes</h2>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                                    {episodes.length} results
                                </span>
                            </div>
                            <div className="grid gap-4">
                                {episodes.map((episode, index) => (
                                    <PodcastEpisode
                                        key={episode.id}
                                        episode={episode}
                                        podcast={episode.podcast}
                                        index={index + 1}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
