import { useEffect, useRef, useState } from "react";
import { AudioContext } from "./AudioContext";
import { saveRecentlyPlayed } from "@/api/recentlyPlayed.api";

export default function AudioProvider({ children }) {
    const audioRef = useRef(null)

    const [currentTrack, setCurrentTrack] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [muted, setMuted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // 🔴 Playlist queue state 🔴
    const [playlist, setPlaylist] = useState([])
    const [currentIndex, setCurrentIndex] = useState(-1)
    // 🔴 Play-Playlist 🔴

    useEffect(() => {
        const audio = new Audio()
        audioRef.current = audio

        const onLoadMetadata = () => {
            setDuration(audio.duration)
            setIsLoading(false)
        }

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const onVolumeChange = () => {
            setVolume(audio.volume)
            setMuted(audio.muted)
        }

        const onEnded = () => {
            setIsPlaying(false)
        }

        const onWaiting = () => setIsLoading(true)
        const onCanPlay = () => setIsLoading(false)
        const onLoadStart = () => setIsLoading(true)

        audio.addEventListener("loadedmetadata", onLoadMetadata)
        audio.addEventListener("timeupdate", onTimeUpdate)
        audio.addEventListener("volumechange", onVolumeChange)
        audio.addEventListener("ended", onEnded)
        audio.addEventListener("waiting", onWaiting)
        audio.addEventListener("canplay", onCanPlay)
        audio.addEventListener("loadstart", onLoadStart)

        return () => {
            audio.pause()
            audio.removeEventListener("loadedmetadata", onLoadMetadata)
            audio.removeEventListener("timeupdate", onTimeUpdate)
            audio.removeEventListener("volumechange", onVolumeChange)
            audio.removeEventListener("ended", onEnded)
            audio.removeEventListener("waiting", onWaiting)
            audio.removeEventListener("canplay", onCanPlay)
            audio.removeEventListener("loadstart", onLoadStart)
        }
    }, [])

    
    // 🔴 Auto-advance to next track when current track ends 🔴
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleAutoAdvance = () => {
            if (playlist.length > 0 && currentIndex < playlist.length - 1) {
                const nextIndex = currentIndex + 1
                setCurrentIndex(nextIndex)
                // Trigger playback of next track
                const nextTrack = playlist[nextIndex]
                if (nextTrack) {
                    setIsLoading(true)
                    setCurrentTrack(nextTrack)
                    audio.src = nextTrack.audio_path
                    audio.currentTime = 0
                    audio.play()
                    setIsPlaying(true)
                }
            }
        }

        audio.addEventListener("ended", handleAutoAdvance)
        return () => audio.removeEventListener("ended", handleAutoAdvance)
    }, [playlist, currentIndex])
    // 🔴 Play-Playlist 🔴

    // Track recently played on track change
    useEffect(() => {
        if (currentTrack && !currentTrack.podcast) {
            saveRecentlyPlayed(currentTrack.id, 0);
        }
    }, [currentTrack]);

    // Save on unmount helper
    useEffect(() => {
        return () => {
            if (currentTrack && !currentTrack.podcast && audioRef.current) {
                saveRecentlyPlayed(currentTrack.id, Math.round(audioRef.current.currentTime));
            }
        }
    }, [currentTrack, isPlaying]); // ensures we have latest state

    function playTrack(track) {
        if (!audioRef.current) return

        if (currentTrack?.id === track.id) {
            audioRef.current.play()
            setIsPlaying(true)
            return
        }

        setIsLoading(true)
        setCurrentTrack(track)
        audioRef.current.src = track.audio_path
        audioRef.current.currentTime = 0
        audioRef.current.play()
        setIsPlaying(true)
    }

    function pauseTrack() {
        if (!audioRef.current) return

        audioRef.current.pause()
        setIsPlaying(false)

        if (currentTrack && !currentTrack.podcast) {
            saveRecentlyPlayed(currentTrack.id, Math.round(audioRef.current.currentTime));
        }
    }

    function seek(seconds) {
        if (!audioRef.current) return
        audioRef.current.currentTime = seconds
        setCurrentTime(seconds)
    }

    function changeVolume(value) {
        if (!audioRef.current) return
        audioRef.current.volume = value
        setVolume(value)
    }

    function toggleMuted() {
        if (!audioRef.current) return
        audioRef.current.muted = !audioRef.current.muted
        setMuted(audioRef.current.muted)
    }
    // 🔴 Play-Playlist 🔴
    function playPlaylist(tracks, startIndex = 0) {
        if (!tracks || tracks.length === 0) return

        setPlaylist(tracks)
        setCurrentIndex(startIndex)
        playTrack(tracks[startIndex])
    }

    function playNext() {
        if (playlist.length === 0) return
        if (currentIndex < playlist.length - 1) {
            const nextIndex = currentIndex + 1
            setCurrentIndex(nextIndex)
            playTrack(playlist[nextIndex])
        }
    }

    function playPrevious() {
        if (playlist.length === 0) return
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1
            setCurrentIndex(prevIndex)
            playTrack(playlist[prevIndex])
        }
    }
    // 🔴 Play-Playlist 🔴

    return (
        <AudioContext.Provider value={{
            currentTrack,
            isPlaying,
            currentTime,
            duration,
            volume,
            muted,
            isLoading,
            // 🔴 Playlist queue state 🔴
            playlist,
            currentIndex,
            // 🔴 Playlist queue state 🔴
            playTrack,
            pauseTrack,
            seek,
            changeVolume,
            // 🔴 Play-Playlist 🔴
            toggleMuted,
            playPlaylist,
            playNext,
            playPrevious
            // 🔴 Play-Playlist 🔴
        }}>
            {children}
        </AudioContext.Provider>
    )
}