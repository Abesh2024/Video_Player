import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Use icons as needed

const VideoPlayer = ({ src }) => {
    const videoRef = useRef(null);
    const intervalRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        const handleVideoEnd = () => {
            setIsPlaying(false);
            setProgress(0);
            stopProgressLoop();
        };

        if (video) {
            video.addEventListener("ended", handleVideoEnd);
        }

        return () => {
            if (video) {
                video.removeEventListener("ended", handleVideoEnd);
            }
            stopProgressLoop();
        };
    }, []);

    const updateProgress = () => {
        if (videoRef.current) {
            const value = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(value);
        }
    };

    const startProgressLoop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            updateProgress();
        }, 1000);
    };

    const stopProgressLoop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
                startProgressLoop();
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
                stopProgressLoop();
            }
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
        setProgress(e.target.value);
    };

    const renderCustomControls = () => {
        return (
            <div className="controls mt-2 flex flex-col">
                {/* Play/Pause Button */}
                <button
                    className="play-pause-btn"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? "Pause" : "Play"}
                    {/* Alternatively, use icons: isPlaying ? <FaPause /> : <FaPlay /> */}
                </button>

                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="progress-bar"
                />

                {/* Volume Control */}
                <div className="volume-control mt-2">
                    <button onClick={toggleMute}>
                        {isMuted ? "Unmute" : "Mute"}
                        {/* Alternatively, use icons: isMuted ? <FaVolumeMute /> : <FaVolumeUp /> */}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="video-player-container">
            <h1>Video Player</h1>
            <video
                ref={videoRef}
                src={src}
                onClick={togglePlayPause}
                onPlay={startProgressLoop}
                onPause={stopProgressLoop}
                className="video-element w-full"
                controls={false} // We are implementing custom controls
            />

            {/* Custom Controls */}
            {renderCustomControls()}
        </div>
    );
};

export default VideoPlayer;
