// import { useEffect } from 'react';
// import { usePlayer } from '../../hooks/redux';
// import { X, ExternalLink, Volume2, Play, Pause } from 'lucide-react';

// const VideoPlayer = () => {
//   const {
//     currentTrackId,
//     showVideoComponent,
//     currentTrack,
//     isPlaying,
//     videoRef,
//     isMuted,
//     playPause,
//     registerVideoRef,
//     navigate,
//   } = usePlayer();

//   useEffect(() => {
//     const video = videoRef;
//     if (!video) return;

//     video.muted = isMuted;
//     video.load();

//     if (isPlaying) {
//       const playPromise = video.play();
//       if (playPromise !== undefined) {
//         playPromise.catch((err) => {
//           console.error('Autoplay failed:', err);
//         });
//       }
//     } else {
//       video.pause();
//     }
//   }, [currentTrack?.id, isPlaying, isMuted]);

//   if (!currentTrackId || !showVideoComponent) {
//     return null;
//   }

//   return (
//     <div className="w-80 h-full sticky top-0 pl-2 border-l bg- border-[#1d1d1d] hidden md:flex flex-col">
//       <div>
//         <div className="flex-1 flex items-center justify-center ">
//           {currentTrack?.video ? (
//             <div className="relative w-full h-80 group">
//               <button
//                 onClick={() => navigate('/video-detail')}
//                 className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
//                 title="Open in Full View"
//               >
//                 <ExternalLink size={18} />
//               </button>

//               <video
//                 ref={(el) => el && registerVideoRef(el)}
//                 className="w-full h-full object-cover overflow-hidden rounded-lg shadow-2xl"
//                 muted={isMuted}
//                 loop
//                 playsInline
//                 poster={currentTrack?.image}
//               >
//                 <source src={currentTrack?.video} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             </div>
//           ) : (
//             <div className="w-full h-64 z-30 bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg flex items-center justify-center">
//               <div className="text-center">
//                 <Volume2 className="w-16 h-16 text-white/50 mx-auto mb-4" />
//                 <p className="text-white/70">Audio Only</p>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="p-4 space-y-4">
//           <div className="flex items-center justify-between">
//             <button
//               className="bg-green-500 hover:bg-green-400 rounded-full p-3 transition-colors"
//               onClick={playPause}
//             >
//               {isPlaying ? (
//                 <Pause className="w-5 h-5 text-black" />
//               ) : (
//                 <Play className="w-5 h-5 text-black ml-1" />
//               )}
//             </button>
//             <div className="text-center">
//               <div className="text-white font-medium">{currentTrack?.title}</div>
//               <div className="text-gray-400 text-sm">{currentTrack?.artists}</div>
//             </div>
//             <div></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;


import { useEffect } from 'react';
import { usePlayer } from '../../hooks/redux';
import { ExternalLink, Volume2, Play, Pause } from 'lucide-react';

const VideoPlayer = () => {
  const {
    currentTrackId,
    showVideoComponent,
    currentTrack,
    isPlaying,
    videoRef, // This should come from usePlayer hook
    isMuted,
    playPause, // This should be togglePlay from usePlayer
    navigate,
  } = usePlayer();

useEffect(() => {
  const videoEl = videoRef?.current;
  const sourceVideo = videoEl;

  const syncHandler = () => {
    if (videoEl && sourceVideo && Math.abs(videoEl.currentTime - sourceVideo.currentTime) > 0.5) {
      videoEl.currentTime = sourceVideo.currentTime;
    }
  };

  if (sourceVideo && videoEl) {
    sourceVideo.addEventListener('timeupdate', syncHandler);
  }

  return () => {
    if (sourceVideo) sourceVideo.removeEventListener('timeupdate', syncHandler);
  };
}, [videoRef?.current]);


  // Don't render if no track or video component is hidden
  if (!currentTrackId || !showVideoComponent) {
    return null;
  }

  return (
    <div className="w-80 h-full sticky top-0 pl-2 border-l bg-black border-[#1d1d1d] hidden md:flex flex-col">
      <div>
        <div className="flex-1 flex items-center justify-center">
          {currentTrack?.video || currentTrack?.videoUrl ? (
            <div className="relative w-full h-80 group">
              <button
                onClick={() => navigate('/video-detail')}
                className="absolute top-2 right-2 z-20 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                title="Open in Full View"
              >
                <ExternalLink size={18} />
              </button>

              {/* This video element will be synced with the hidden one in GlobalAudioManager */}
              <video
                className="w-full h-full object-cover overflow-hidden rounded-lg shadow-2xl"
                muted={isMuted}
                loop
                playsInline
                poster={currentTrack?.image}
                ref={(el) => {
                  if (el && !videoRef.current) {
                      videoRef.current = el; // Register local video player if not already
                    }
                  if (el && videoRef?.current && el !== videoRef.current) {
                    const sourceVideo = videoRef.current;
                    
                    // Copy source and current time
                    if (sourceVideo.src) {
                      el.src = sourceVideo.src;
                      el.currentTime = sourceVideo.currentTime;
                      
                      // Sync play state
                      if (isPlaying && !sourceVideo.paused) {
                        el.play().catch(console.error);
                      } else if (!isPlaying && sourceVideo.paused) {
                        el.pause();
                      }
                    }
                    
                    // Keep them in sync
                    const syncHandler = () => {
                      if (Math.abs(el.currentTime - sourceVideo.currentTime) > 0.5) {
                        el.currentTime = sourceVideo.currentTime;
                      }
                    };
                    
                    sourceVideo.addEventListener('timeupdate', syncHandler);
                    sourceVideo.addEventListener('play', () => el.play().catch(console.error));
                    sourceVideo.addEventListener('pause', () => el.pause());
                    sourceVideo.addEventListener('loadeddata', () => {
                      el.src = sourceVideo.src;
                      el.currentTime = sourceVideo.currentTime;
                    });
                    
                    // Cleanup
                    return () => {
                      sourceVideo.removeEventListener('timeupdate', syncHandler);
                    };
                  }
                }}
              >
                <source src={currentTrack?.video || currentTrack?.title} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="w-full h-64 z-30 bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Volume2 className="w-16 h-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Audio Only</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-400 rounded-full p-3 transition-colors"
              onClick={playPause}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black ml-1" />
              )}
            </button>
            <div className="text-center">
              <div className="text-white font-medium">{currentTrack?.title}</div>
              <div className="text-gray-400 text-sm">{currentTrack?.artists}</div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;