import { useNavigate } from "react-router-dom";
import { ListMusic, Podcast, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Library = () => {
    const navigate = useNavigate();

    return (
        <div className="mx-auto max-w-7xl px-8 py-10 space-y-10 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter text-white">Your Library</h1>
                <p className="text-muted-foreground text-sm font-medium">Capture your favorite sounds and stories in one place.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Playlists Quick Access */}
                <div
                    className="group p-8 rounded-3xl bg-card/40 border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate("/playlists")}
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <ListMusic size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Playlists</h3>
                    <p className="text-sm text-muted-foreground">Manage and created your custom collections.</p>
                </div>

                {/* Podcasts Quick Access */}
                <div
                    className="group p-8 rounded-3xl bg-card/40 border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate("/podcasts")}
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <Podcast size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Podcasts</h3>
                    <p className="text-sm text-muted-foreground">Stay updated with the shows you follow.</p>
                </div>

                {/* Explore Quick Access */}
                <div
                    className="group p-8 rounded-3xl bg-card/40 border border-white/5 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate("/explore")}
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <Music2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Discover More</h3>
                    <p className="text-sm text-muted-foreground">Find something new to listen to.</p>
                </div>
            </div>

            <div className="py-20 flex flex-col items-center justify-center text-center bg-card/10 rounded-4xl border border-dashed border-white/5 gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                    <ListMusic size={32} />
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">Start Building Your Collection</h2>
                    <p className="text-muted-foreground max-w-md">Like songs, create playlists, and follow podcasts to see them here.</p>
                </div>
                <Button variant="outline" className="mt-4 rounded-full px-8" onClick={() => navigate("/")}>Go Home</Button>
            </div>
        </div>
    );
};

export default Library;
