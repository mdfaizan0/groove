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
            // Save history on unmount if playing a music track
            if (audioRef.current && !audioRef.current.paused) {
                // We can't easily access currentTrack here in the cleanup of THE SAME effect
                // but we can use a ref for the current track to be safe
                // or just rely on the other effects.
            }
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

    // Track recently played on track change
    useEffect(() => {
        if (currentTrack && !currentTrack.podcast) {
            saveRecentlyPlayed(currentTrack.id, 0);
        }
    }, [currentTrack?.id]);

    // Save on unmount helper
    useEffect(() => {
        return () => {
            if (currentTrack && !currentTrack.podcast && audioRef.current) {
                saveRecentlyPlayed(currentTrack.id, Math.round(audioRef.current.currentTime));
            }
        }
    }, [currentTrack?.id, isPlaying]); // ensures we have latest state

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

    return (
        <AudioContext.Provider value={{
            currentTrack,
            isPlaying,
            currentTime,
            duration,
            volume,
            muted,
            isLoading,
            playTrack,
            pauseTrack,
            seek,
            changeVolume,
            toggleMuted
        }}>
            {children}
        </AudioContext.Provider>
    )
}