import { useNavigate } from "react-router-dom"
import { Play } from "lucide-react"

const PodcastCard = ({ podcast }) => {
    const navigate = useNavigate()
    return (
        <div
            className="group relative flex flex-col gap-3 p-4 rounded-2xl bg-card/40 border border-white/5 hover:bg-white/10 transition-all duration-500 cursor-pointer overflow-hidden animate-in fade-in zoom-in-95"
            onClick={() => navigate(`/podcast/${podcast.id}`)}
        >
            {/* Cover Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-xl">
                <img
                    src={podcast.cover_image_url || "https://images.unsplash.com/photo-1478737270239-2fccd27ee086?w=400&h=400&fit=crop"}
                    alt={podcast.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-lg">
                        <Play size={24} fill="currentColor" className="text-primary-foreground ml-1" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 min-w-0">
                <h2 className="text-base font-bold text-white truncate group-hover:text-primary transition-colors">
                    {podcast.title}
                </h2>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {podcast.description}
                </p>
            </div>

            {/* Decorative background blur */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
        </div>
    )
}

export default PodcastCard