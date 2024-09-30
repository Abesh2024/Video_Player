import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Importing icons

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
            <div className="controls mt-2 flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Play/Pause Button */}
                <button
                    className="play-pause-btn flex items-center justify-center p-2 bg-gray-700 rounded-md text-white md:mr-4"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>

                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="progress-bar mt-2 w-full md:mt-0 md:flex-grow md:mx-4"
                />

                {/* Volume Control */}
                <div className="volume-control mt-2 flex items-center md:mt-0">
                    <button onClick={toggleMute} className="p-2 bg-gray-700 rounded-md text-white mr-2">
                        {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider ml-2 w-full"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="video-player-container p-4 bg-gray-900 rounded-md shadow-lg max-w-full md:max-w-3xl mx-auto">
            <h1 className="text-white text-center text-2xl font-bold mb-4">Video Player</h1>
            <video
                ref={videoRef}
                src={src}
                onClick={togglePlayPause}
                onPlay={startProgressLoop}
                onPause={stopProgressLoop}
                className="video-element w-full h-auto rounded-lg"
                controls={false} // Custom controls
            />

            {/* Custom Controls */}
            {renderCustomControls()}
        </div>
    );
};

export default VideoPlayer;
