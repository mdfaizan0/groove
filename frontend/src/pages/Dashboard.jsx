import { useAuth } from "@/context/auth/useAuth"
import { ShieldCheck, Mail, Calendar, Headset, Music4, Timer, History, Plus, Trash2, Upload, LayoutGrid, Mic2, Pencil } from "lucide-react"
import { useRecentlyPlayed } from "@/hooks/recentlyPlayed/useRecentlyPlayed"
import TrackCard from "@/components/track/TrackCard"
import Loading from "@/components/Loading"
import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import * as adminApi from "@/api/admin.api"
import { fetchCategories } from "@/api/categories.api"
import { fetchPodcastCollections } from "@/api/podcasts.api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const getAudioDuration = (file) => {
    return new Promise((resolve) => {
        const audio = new Audio()
        audio.src = URL.createObjectURL(file)
        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(audio.src)
            resolve(Math.floor(audio.duration))
        }
    })
}

function Dashboard() {
    const { user } = useAuth()
    const isAdmin = user?.user_metadata?.role === "admin"
    const { tracks: recentTracks, loading: recentLoading } = useRecentlyPlayed()

    // Admin State
    const [categories, setCategories] = useState([])
    const [podcasts, setPodcasts] = useState([])
    const [loading, setLoading] = useState(false)

    // Form States
    const [categoryName, setCategoryName] = useState("")
    const [trackData, setTrackData] = useState({ title: "", artist: "", duration: "", category_id: "" })
    const [trackFiles, setTrackFiles] = useState({ audioFile: null, coverImage: null })
    const [podcastData, setPodcastData] = useState({ title: "", description: "" })
    const [podcastCover, setPodcastCover] = useState(null)
    const [episodeData, setEpisodeData] = useState({ title: "", description: "", duration: "", collection_id: "" })
    const [episodeAudio, setEpisodeAudio] = useState(null)

    // Refs for resetting file inputs
    const trackAudioRef = useRef(null)
    const trackCoverRef = useRef(null)
    const podcastCoverRef = useRef(null)
    const episodeAudioRef = useRef(null)

    useEffect(() => {
        if (isAdmin) {
            loadAdminData()
        }
    }, [isAdmin])

    const loadAdminData = async () => {
        try {
            const [cats, pods] = await Promise.all([fetchCategories(), fetchPodcastCollections()])
            setCategories(cats)
            setPodcasts(pods)
        } catch (error) {
            console.error("Failed to load admin data", error)
        }
    }

    // Handlers
    const handleCreateCategory = async () => {
        if (!categoryName) return
        setLoading(true)
        try {
            await adminApi.createCategory({ name: categoryName })
            toast.success("Category created")
            setCategoryName("")
            loadAdminData()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCategory = async (id) => {
        try {
            await adminApi.deleteCategory(id)
            toast.success("Category deleted")
            loadAdminData()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleUploadTrack = async (e) => {
        e.preventDefault()
        if (!trackFiles.audioFile || !trackFiles.coverImage) {
            return toast.error("Please select both audio and cover files")
        }
        setLoading(true)
        const formData = new FormData()
        Object.entries(trackData).forEach(([key, value]) => formData.append(key, value))
        formData.append("audioFile", trackFiles.audioFile)
        formData.append("coverImage", trackFiles.coverImage)

        try {
            await adminApi.createTrack(formData)
            toast.success("Track uploaded successfully")
            setTrackData({ title: "", artist: "", duration: "", category_id: "" })
            setTrackFiles({ audioFile: null, coverImage: null })
            if (trackAudioRef.current) trackAudioRef.current.value = ""
            if (trackCoverRef.current) trackCoverRef.current.value = ""
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCreatePodcast = async (e) => {
        e.preventDefault()
        if (!podcastCover) return toast.error("Cover image is required")
        setLoading(true)
        const formData = new FormData()
        Object.entries(podcastData).forEach(([key, value]) => formData.append(key, value))
        formData.append("coverImage", podcastCover)

        try {
            await adminApi.createPodcastCollection(formData)
            toast.success("Podcast collection created")
            setPodcastData({ title: "", description: "" })
            setPodcastCover(null)
            if (podcastCoverRef.current) podcastCoverRef.current.value = ""
            loadAdminData()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadEpisode = async (e) => {
        e.preventDefault()
        if (!episodeAudio) return toast.error("Audio file is required")
        setLoading(true)
        const formData = new FormData()
        Object.entries(episodeData).forEach(([key, value]) => formData.append(key, value))
        formData.append("audioFile", episodeAudio)

        try {
            await adminApi.createPodcastEpisode(formData)
            toast.success("Episode uploaded successfully")
            setEpisodeData({ title: "", description: "", duration: "", collection_id: "" })
            setEpisodeAudio(null)
            if (episodeAudioRef.current) episodeAudioRef.current.value = ""
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleTrackAudioChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                const duration = await getAudioDuration(file)
                setTrackData(prev => ({ ...prev, duration: duration.toString() }))
                setTrackFiles(prev => ({ ...prev, audioFile: file }))
            } catch (error) {
                toast.error("Failed to get audio duration")
                console.error(error)
            }
        }
    }

    const handleEpisodeAudioChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                const duration = await getAudioDuration(file)
                setEpisodeData(prev => ({ ...prev, duration: duration.toString() }))
                setEpisodeAudio(file)
            } catch (error) {
                toast.error("Failed to get audio duration")
                console.error(error)
            }
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-8 py-10 space-y-10 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter text-white">Dashboard</h1>
                <p className="text-muted-foreground text-sm font-medium">Manage your account and view your listening insights.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-card/40 border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden group">
                        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/30 shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105">
                            <span className="text-5xl font-black text-primary">
                                {user?.user_metadata?.name?.[0]?.toUpperCase() ?? "U"}
                            </span>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-4 z-10">
                            <div>
                                <h2 className="text-3xl font-black text-white">{user?.user_metadata?.name ?? "User"}</h2>
                                <div className="flex items-center gap-2">
                                    <p className="text-primary font-bold text-sm tracking-widest uppercase">
                                        {isAdmin ? "Admin Administrator" : "Premium Listener"}
                                    </p>
                                    {isAdmin && <ShieldCheck size={16} className="text-primary" />}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground text-sm hover:text-white transition-colors">
                                    <Mail size={16} />
                                    <span className="flex items-center gap-2">
                                        {user?.email}
                                        {user?.user_metadata?.email_verified &&
                                            <ShieldCheck size={16} className="text-green-500" title="Verified Email" />}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground text-sm">
                                    <Calendar size={16} />
                                    <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Dec 2025'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: "Hours Listened", value: "124", icon: Timer },
                            { label: "Tracks Played", value: "1,240", icon: Music4 },
                            { label: "Podcasts Subscribed", value: "8", icon: Headset }
                        ].map((stat, i) => (
                            <div key={i} className="group p-6 rounded-3xl bg-card/20 border border-white/5 space-y-4 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <stat.icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-3xl font-black text-white">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recently Played Section */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-3 text-white">
                            <History size={24} className="text-primary" />
                            <h2 className="text-2xl font-black tracking-tight">Recently Played</h2>
                        </div>

                        {recentLoading ? (
                            <div className="py-10 flex justify-center"><Loading /></div>
                        ) : recentTracks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentTracks.slice(0, 6).map((track) => (
                                    <TrackCard key={track.id} track={track} variant="horizontal" />
                                ))}
                            </div>
                        ) : (
                            <div className="p-10 rounded-3xl bg-card/10 border border-dashed border-white/5 text-center">
                                <p className="text-muted-foreground italic text-sm">No recently played tracks yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Security / Settings Quick Links */}
                <div className="space-y-6">
                    <div className="p-8 rounded-3xl bg-linear-to-b from-primary/10 to-transparent border border-primary/20 space-y-6 shadow-xl shadow-primary/5 h-full">
                        <div className="flex items-center gap-3 text-white">
                            <ShieldCheck size={24} className="text-primary" />
                            <h3 className="text-xl font-bold">Account Security</h3>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white/90">Multi-factor Auth</p>
                                    <p className="text-xs text-muted-foreground">Enabled for maximum protection.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white/90">Verified Account</p>
                                    <p className="text-xs text-muted-foreground">Your identity is fully confirmed.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-1 h-1 bg-primary rounded-full mt-2 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white/90">Device Management</p>
                                    <p className="text-xs text-muted-foreground">Access is restricted to 3 active devices.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/5">
                                Account Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADMIN PANEL */}
            {isAdmin && (
                <div className="space-y-10 pt-10 border-t border-white/5 animate-in slide-in-from-bottom-5 duration-700">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <ShieldCheck size={28} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tighter text-white">Admin Control Center</h2>
                            <p className="text-muted-foreground text-sm font-medium">Manage categories, tracks, and podcasts collections.</p>
                        </div>
                    </div>

                    <Tabs defaultValue="tracks" className="w-full space-y-8">
                        <TabsList className="bg-card/20 border border-white/5 p-1 rounded-2xl h-14">
                            <TabsTrigger value="categories" className="rounded-xl h-full px-8 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                <LayoutGrid size={16} className="mr-2" />
                                Categories
                            </TabsTrigger>
                            <TabsTrigger value="tracks" className="rounded-xl h-full px-8 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                <Music4 size={16} className="mr-2" />
                                Tracks
                            </TabsTrigger>
                            <TabsTrigger value="podcasts" className="rounded-xl h-full px-8 text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                                <Mic2 size={16} className="mr-2" />
                                Podcasts
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="categories" className="space-y-8 outline-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-4xl bg-card/20 border border-white/5 space-y-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Plus size={20} className="text-primary" />
                                        New Category
                                    </h3>
                                    <div className="space-y-4">
                                        <Input
                                            placeholder="Category Name"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            className="bg-black/20 border-white/5 rounded-xl h-12"
                                        />
                                        <Button
                                            onClick={handleCreateCategory}
                                            disabled={loading || !categoryName}
                                            className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all active:scale-95"
                                        >
                                            {loading ? "Creating..." : "Create Category"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-8 rounded-4xl bg-card/20 border border-white/5 space-y-6">
                                    <h3 className="text-xl font-bold text-white">Existing Categories</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                                <span className="font-bold text-white/90">{cat.name}</span>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-neutral-900 border-white/5 rounded-4xl">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the category "{cat.name}".
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-xl border-white/5">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteCategory(cat.id)}
                                                                className="bg-red-500 hover:bg-red-600 rounded-xl"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="tracks" className="outline-hidden">
                            <div className="max-w-3xl mx-auto p-8 rounded-[2.5rem] bg-card/20 border border-white/5 space-y-8">
                                <div className="flex items-center gap-3">
                                    <Upload size={24} className="text-primary" />
                                    <h3 className="text-2xl font-bold text-white">Upload New Track</h3>
                                </div>
                                <form onSubmit={handleUploadTrack} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Title</label>
                                        <Input
                                            required
                                            placeholder="Midnight Rain"
                                            value={trackData.title}
                                            onChange={(e) => setTrackData({ ...trackData, title: e.target.value })}
                                            className="bg-black/20 border-white/5 rounded-xl h-12 placeholder:text-muted-foreground/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Artist</label>
                                        <Input
                                            required
                                            placeholder="Taylor Swift"
                                            value={trackData.artist}
                                            onChange={(e) => setTrackData({ ...trackData, artist: e.target.value })}
                                            className="bg-black/20 border-white/5 rounded-xl h-12 placeholder:text-muted-foreground/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Category</label>
                                        <Select
                                            required
                                            onValueChange={(val) => setTrackData({ ...trackData, category_id: val })}
                                            value={trackData.category_id}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/5 rounded-xl h-12">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-neutral-900 border-white/5">
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Audio File (MP3/WAV)</label>
                                        <Input
                                            required
                                            type="file"
                                            accept="audio/*"
                                            ref={trackAudioRef}
                                            onChange={handleTrackAudioChange}
                                            className="bg-black/20 border-white/5 rounded-xl h-12 pt-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Cover Image (JPEG/PNG)</label>
                                        <Input
                                            required
                                            type="file"
                                            accept="image/*"
                                            ref={trackCoverRef}
                                            onChange={(e) => setTrackFiles({ ...trackFiles, coverImage: e.target.files[0] })}
                                            className="bg-black/20 border-white/5 rounded-xl h-12 pt-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
                                        >
                                            {loading ? "Uploading..." : "Publish Track"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </TabsContent>

                        <TabsContent value="podcasts" className="space-y-10 outline-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* NEW COLLECTION */}
                                <div className="p-8 rounded-[2.5rem] bg-card/20 border border-white/5 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Mic2 size={24} className="text-primary" />
                                        <h3 className="text-xl font-bold text-white">Create Collection</h3>
                                    </div>
                                    <form onSubmit={handleCreatePodcast} className="space-y-4">
                                        <Input
                                            required
                                            placeholder="Podcast Title"
                                            value={podcastData.title}
                                            onChange={(e) => setPodcastData({ ...podcastData, title: e.target.value })}
                                            className="bg-black/20 border-white/5 rounded-xl h-12"
                                        />
                                        <Textarea
                                            placeholder="Description"
                                            value={podcastData.description}
                                            onChange={(e) => setPodcastData({ ...podcastData, description: e.target.value })}
                                            className="bg-black/20 border-white/5 rounded-2xl min-h-25"
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Cover Image</label>
                                            <Input
                                                required
                                                type="file"
                                                accept="image/*"
                                                ref={podcastCoverRef}
                                                onChange={(e) => setPodcastCover(e.target.files[0])}
                                                className="bg-black/20 border-white/5 rounded-xl h-12 pt-2"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all active:scale-95"
                                        >
                                            {loading ? "Creating..." : "Create Collection"}
                                        </Button>
                                    </form>
                                </div>

                                {/* NEW EPISODE */}
                                <div className="p-8 rounded-[2.5rem] bg-card/20 border border-white/5 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Plus size={24} className="text-secondary" />
                                        <h3 className="text-xl font-bold text-white">Add Episode</h3>
                                    </div>
                                    <form onSubmit={handleUploadEpisode} className="space-y-4">
                                        <Input
                                            required
                                            placeholder="Episode Title"
                                            value={episodeData.title}
                                            onChange={(e) => setEpisodeData({ ...episodeData, title: e.target.value })}
                                            className="bg-black/20 border-white/5 rounded-xl h-12"
                                        />
                                        <Select
                                            required
                                            onValueChange={(val) => setEpisodeData({ ...episodeData, collection_id: val })}
                                            value={episodeData.collection_id}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/5 rounded-xl h-12">
                                                <SelectValue placeholder="Select Collection" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-neutral-900 border-white/5">
                                                {podcasts.map((pod) => (
                                                    <SelectItem key={pod.id} value={pod.id.toString()}>{pod.title}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Textarea
                                            placeholder="Episode Description"
                                            value={episodeData.description}
                                            onChange={(e) => setEpisodeData({ ...episodeData, description: e.target.value })}
                                            className="bg-black/20 border-white/5 rounded-2xl min-h-25"
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Audio File</label>
                                            <Input
                                                required
                                                type="file"
                                                accept="audio/*"
                                                ref={episodeAudioRef}
                                                onChange={handleEpisodeAudioChange}
                                                className="bg-black/20 border-white/5 rounded-xl h-12 pt-2"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all active:scale-95"
                                        >
                                            {loading ? "Uploading..." : "Publish Episode"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    )
}

export default Dashboard
