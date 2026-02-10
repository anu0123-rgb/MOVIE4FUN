
import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Download, SkipBack, SkipForward, ChevronRight } from 'lucide-react';
import { VideoQuality } from '../types';

interface PlayerProps {
  src: string;
  title: string;
  isDownloadable: boolean;
  qualities: VideoQuality[];
}

const CustomVideoPlayer: React.FC<PlayerProps> = ({ src, title, isDownloadable, qualities }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeQuality, setActiveQuality] = useState<VideoQuality>(qualities[qualities.length - 1] || '720p');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMute = !isMuted;
      setIsMuted(newMute);
      videoRef.current.muted = newMute;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative group bg-black rounded-xl overflow-hidden shadow-2xl aspect-video w-full max-w-5xl mx-auto"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => !isSettingsOpen && isPlaying && setShowControls(false)}
    >
      <video 
        ref={videoRef}
        src={src}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Overlays */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Top Info */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          {isDownloadable && (
            <a 
              href={src} 
              download 
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
              title="Download Video"
            >
              <Download size={20} />
            </a>
          )}
        </div>

        {/* Playback Progress */}
        <div className="absolute bottom-16 left-0 right-0 px-6">
          <input 
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-red-600 hover:h-2 transition-all"
          />
        </div>

        {/* Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white hover:text-red-500 transition-colors">
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
            </button>
            <div className="flex items-center gap-4 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-gray-300">
                {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white transition-all"
              />
            </div>
            <span className="text-sm font-medium tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="flex gap-4">
              <button onClick={() => skip(-10)} className="hover:text-gray-300"><SkipBack size={20} /></button>
              <button onClick={() => skip(10)} className="hover:text-gray-300"><SkipForward size={20} /></button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`transition-transform duration-300 ${isSettingsOpen ? 'rotate-90' : ''}`}
              >
                <Settings size={24} />
              </button>
              
              {isSettingsOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-2 z-50">
                  <div className="text-xs font-bold text-zinc-500 px-3 py-1 uppercase">Speed</div>
                  {[0.5, 1, 1.5, 2].map(speed => (
                    <button 
                      key={speed}
                      onClick={() => { setPlaybackSpeed(speed); videoRef.current!.playbackRate = speed; }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${playbackSpeed === speed ? 'bg-red-600' : 'hover:bg-zinc-800'}`}
                    >
                      {speed}x
                    </button>
                  ))}
                  <div className="my-1 border-t border-zinc-800" />
                  <div className="text-xs font-bold text-zinc-500 px-3 py-1 uppercase">Quality</div>
                  {qualities.map(q => (
                    <button 
                      key={q}
                      onClick={() => setActiveQuality(q)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${activeQuality === q ? 'bg-red-600' : 'hover:bg-zinc-800'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="hover:text-gray-300">
              <Maximize size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
