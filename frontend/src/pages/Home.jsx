import { useAuth } from "@/context/auth/useAuth";
import { useTracks } from "@/hooks/tracks/useTracks";
import { usePodcasts } from "@/hooks/podcasts/usePodcasts";
import { usePlaylists } from "@/hooks/playlists/usePlaylists";
import Loading from "@/components/Loading";
import TrackCard from "@/components/track/TrackCard";
import PodcastCard from "@/components/podcast/PodcastCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { useRecentlyPlayed } from "@/hooks/recentlyPlayed/useRecentlyPlayed";

const Home = () => {
  const { user } = useAuth();
  const { tracks, loading: tracksLoading } = useTracks();
  const { podcasts, loading: podcastsLoading } = usePodcasts();
  const { playlists, loading: playlistsLoading } = usePlaylists({ enabled: !!user });
  const { tracks: recentlyPlayed, loading: recentLoading } = useRecentlyPlayed();
  const navigate = useNavigate();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (tracksLoading || podcastsLoading || recentLoading) return <Loading />;

  // "New Discoveries" - show latest 5
  const newDiscoveries = [...(tracks || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  // Podcasts - show first 5
  const featuredPodcasts = podcasts?.slice(0, 5) || [];

  return (
    <div className="mx-auto max-w-7xl px-8 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* Welcome Hero */}
      <section className="relative overflow-hidden p-10 rounded-[2.5rem] bg-linear-to-br from-primary/20 via-primary/5 to-transparent border border-white/5 shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
            <Sparkles size={14} className="animate-pulse" />
            <span>Personalized for you</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            {getTimeGreeting()}, {user?.user_metadata?.name?.split(' ')[0] || 'Listener'}
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
            Welcome back to your sonic sanctuary. We've curated the perfect vibe for your journey today.
          </p>
          <div className="pt-4 flex items-center gap-4">
            <Button
              onClick={() => navigate("/explore")}
              className="rounded-full px-8 py-6 h-auto text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              Start Discovering
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/library")}
              className="rounded-full px-8 py-6 h-auto text-base font-bold text-white hover:bg-white/5"
            >
              Your Library
            </Button>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -ml-32 -mb-32" />
      </section>

      {/* Recently Played - Grid layout (Horizontal Cards) */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
              Recently Played
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyPlayed.slice(0, 6).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                variant="horizontal"
                playlists={playlists}
                loading={playlistsLoading}
              />
            ))}
          </div>
        </section>
      )}

      {/* New Discoveries - Vertical Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-white">Newest Discoveries</h2>
            <p className="text-sm text-muted-foreground font-medium">The latest sounds reaching our ears.</p>
          </div>
          <Button
            variant="ghost"
            className="group font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-full px-4"
            onClick={() => navigate("/explore")}
          >
            View All
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {newDiscoveries.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              variant="vertical"
              playlists={playlists}
              loading={playlistsLoading}
            />
          ))}
        </div>
      </section>

      {/* Featured Podcasts */}
      <section className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-white">Trending Podcasts</h2>
            <p className="text-sm text-muted-foreground font-medium">Voice your thoughts. Listen to the world.</p>
          </div>
          <Button
            variant="ghost"
            className="group font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-full px-4"
            onClick={() => navigate("/podcasts")}
          >
            View All
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {featuredPodcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home