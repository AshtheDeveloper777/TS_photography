'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { MediaAsset } from '@/lib/types/media';

interface CinematicVideoSectionProps {
  video: MediaAsset | null;
  posterImage?: string;
}

export default function CinematicVideoSection({
  video,
  posterImage,
}: CinematicVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    setUserInteracted(true);
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        setHasError(true);
      });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  // Only render if a video is found or to document support
  if (!video?.url && !hasError) {
    return null;
  }

  return (
    <section
      id="cinema"
      className="py-24 md:py-36 bg-[#20201E] text-white border-b border-[#D8D2C8]/20"
      aria-label="Cinematic Video Footage"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-6 h-[1px] bg-[#B39A72]" />
              <span className="text-[11px] uppercase tracking-editorial-widest text-[#B39A72] font-interface">
                Motion &amp; Cinema
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#FFFFFF] font-normal leading-tight">
              Stories in <span className="italic font-light text-[#F7F5F0]">Motion.</span>
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-sm text-[#D8D2C8] font-interface max-w-sm font-light leading-relaxed">
            Unscripted movement, authentic sound, and cinematic documentation capturing the rhythm of your day.
          </p>
        </div>

        {/* Video Player Container */}
        {hasError ? (
          <div className="aspect-[16/9] w-full bg-[#2D2D2A] border border-white/10 flex flex-col items-center justify-center p-8 text-center">
            <p className="font-editorial text-2xl text-[#EBE7DF] italic mb-2">
              Video preview unavailable
            </p>
            <p className="text-xs text-[#77746F] max-w-md">
              The video asset in TS_photography is currently processing or encoded in a format that requires external playback.
            </p>
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full bg-[#181816] overflow-hidden border border-white/15 group shadow-2xl">
            <video
              ref={videoRef}
              src={video?.url}
              poster={posterImage}
              playsInline
              muted={isMuted}
              loop
              onTimeUpdate={handleTimeUpdate}
              onError={() => setHasError(true)}
              className="w-full h-full object-cover"
              aria-label="TS Photography studio video footage"
            />

            {/* Initial Big Play Button overlay */}
            {!isPlaying && (
              <div
                className="absolute inset-0 bg-[#20201E]/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity z-20"
                onClick={togglePlay}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:scale-105 transition-all duration-300 hover:border-[#B39A72] hover:bg-[#B39A72]/20">
                  <Play size={32} className="ml-1" />
                </div>
              </div>
            )}

            {/* Custom Luxury Video Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#20201E]/95 via-[#20201E]/60 to-transparent p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/20 mb-4 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-[#B39A72] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="text-white/80 hover:text-white transition-colors focus:outline-none"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-white/80 hover:text-white transition-colors focus:outline-none"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>

                  <span className="text-[11px] uppercase tracking-widest text-white/60 font-interface">
                    {video?.title || 'Cinematic Footage'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="text-white/80 hover:text-white transition-colors focus:outline-none"
                  aria-label="Toggle fullscreen video"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
