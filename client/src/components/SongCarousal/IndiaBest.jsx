import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/axios';
import { useSelector } from 'react-redux';

const SongCarousel = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate()
  const [plays, setPlay] = useState([])
  const currentPlaylistId = useSelector((state) => state.player.currentPlaylistId);

  useEffect(() => {
    const handleSongs = async () => {
      try {
          const res = await api.get('/genre')
          setPlay(res.data.data)
          
      } catch (err) {
        toast.error("Error in fetching Playlist:", err)
      }
    }
    handleSongs()
  }, [])

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return
    const scrollAmount = 320;
    const newScrollLeft = direction === 'left' 
    ? container.scrollLeft - scrollAmount 
    : container.scrollLeft + scrollAmount;
    container.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth'
    });
  };

    const handleScroll = () => {
        const container = scrollRef.current;
        if (!container) return;

        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
    };

  return (
    <div className="bg-[#121212] text-white  p-8">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">India's Best</h2>
          <button onClick={() => navigate('/indiabest')} className="text-xs text-zinc-400 font-semibold hover:border-b border-white h-fit hover:text-xs">
            Show all
          </button>
        </div>

        <div className="relative group">
            {showLeftArrow && (
              <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                <ChevronLeft size={24} />
              </button>
            )}

            {showRightArrow && (
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100" >
                <ChevronRight size={24} />
              </button>
            )}

            <div 
              ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 "
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {plays.map((play) => {
                const isCurrentPlaylist = play.id === currentPlaylistId;
                return (
                  <Link 
                  key={play._id}
                  to={`/playlist/${play._id}`}
                  className={`flex-shrink-0 w-30 md:w-52 hover:bg-[#1d1d1d] rounded-lg p-4 transition-all duration-300 cursor-pointer group/card `}
                >
                  <div className="rounded-lg hover:bg-[#1d1d1d]">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <div className={` md:aspect-square object-cover relative`}>
                        <img src={play.image} className='aspect-square ' alt="" />
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-white md:text-xl text-sm font-semibold mb-1 group-hover/card:text-green-400 transition-colors ${isCurrentPlaylist ? 'text-green-500': 'text-white'}`}>
                        {play.name}
                      </h4>
                      <p className="text-gray-400 text-xs md:text-sm line-clamp-2 leading-tight">
                        {play.description}
                      </p>
                    </div>
                  </div>
                </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
  );
};

export default SongCarousel;