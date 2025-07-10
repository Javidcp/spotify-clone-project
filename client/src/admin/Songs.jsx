import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { toast } from 'react-toastify';
import { X } from 'lucide-react';



const Songs = () => {
    const navigate = useNavigate()
    const [songs, setSongs] = useState([])
    const scrollRef = useRef();
    const audioRef = useRef(new Audio());
    const [playingId, setPlayingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false)
    const [modalSong, setModalSong] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    
    const [page, setPage] = useState(1);
    const [ totalPage, setTotalPage ] = useState(1)
    const limit = 10

    useEffect(() => {
        const fetchSong = async () => {
        try {
            const res = await api.get(`/songs?page=${page}&limit=${limit}`);
            setSongs(res.data.data);
            setTotalPage(res.data.totalPages);
        } catch (err) {
            console.error("Error in fetching songs:", err);
        }
        };
        fetchSong();
        scrollToTop();
    }, [page]);

    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
        };

        const updateDuration = () => {
        setDuration(audio.duration || 0);
        };

        const onEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        setPlayingId(null);
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", onEnded);

        return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", onEnded);
        };
    }, []);

    const openModal = (song) => {
        setModalSong(song);
        setIsOpen(true);
        handlePlayAudio(song);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };


    const handlePlayAudio = (song) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playingId === song._id) {
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
        return;
        }

        audio.pause();
        audio.src = song.url;
        audio.load();
        audio.play();

        setPlayingId(song._id);
        setIsPlaying(true);
    };

    const handleToggleModalAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        } else {
        audio.play();
        setIsPlaying(true);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60) || 0;
        const seconds = Math.floor(time % 60).toString().padStart(2, '0') || '00';
        return `${minutes}:${seconds}`;
    };

    const handleDeleteArtist = async (songId) => {
        try {
        await api.delete(`/songs/deleteSong/${songId}`);
        setSongs((prev) => prev.filter((song) => song._id !== songId));
        toast.success("Song deleted successfully");
        } catch (err) {
        toast.error("Error deleting artist");
        console.error(err);
        }
    };

    const handlePageClick = (pageNum) => {
        setPage(pageNum);
        scrollToTop();
    };


    return (
        <div className='mt-11 text-white min-h-screen' ref={scrollRef}>
            <div className={`transition-all duration-300 ${isOpen ? 'blur-sm scale-95' : ''}`}>
                <div className={`flex justify-between items-center`}>
                    <h2 className='text-2xl font-bold'>Song List</h2>
                    <button onClick={() => navigate('/admin/addSong')} className='bg-blue-500 p-2 rounded-md'>
                        Add Songs
                    </button>
                </div>
                <div >
                    <table className="min-w-full border-collapse border border-[#191919] mt-3">
                        <tr className="bg-[#1d1d1d] text-left sticky top-15">
                            <th className="border border-[#696969] p-2 w-15">Image</th>
                            <th className="border border-[#696969] p-2">Song Name</th>
                            <th className="border border-[#696969] p-2">Artist</th>
                            <th className="border border-[#696969] p-2">Song</th>
                            <th className="border border-[#696969] p-2">Duration</th>
                            <th className="border border-[#696969] p-2">Play Count</th>
                            <th className="border border-[#696969] p-2">Genre</th>
                            <th className="border border-[#696969] p-2">Action</th>
                        </tr>
                        {songs.map(song => (
                            <tr key={song._id} className="border-b border-[#191919]">
                                <td className="p-2 border border-[#191919]">
                                    <img src={song.coverImage} className='w-12 h-12 object-cover object-top ' alt="" />
                                </td>
                                <td className="p-2 border border-[#191919]">
                                    {song.title}
                                </td>
                                <td className="p-2 border border-[#191919]">
                                    {song.artist.map((a, i) => (
                                        <span key={a._id}>
                                            {a.name}{i < song.artist.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </td>
                                <td className="p-2 border w-30 border-[#191919]">
                                    <button
                                        onClick={() => openModal(song)}
                                        className={`bg-[#1ED760] text-white px-2 py-1 rounded`}
                                    >
                                        Play Song
                                    </button>
                                </td>
                                <td className="p-2 border border-[#191919]">
                                    {song.duration}
                                </td>
                                <td className="p-2 border border-[#191919]">
                                    {song.playCount}
                                </td>
                                <td className="p-2 border border-[#191919]">
                                    {song.genre?.name || "Unknown"}
                                </td>
                                <td className='flex gap-2 justify-center items-center'>
                                    <button onClick={() => navigate(`/admin/editSong/${song._id}`)} className='p-2 mt-3 rounded bg-blue-500'>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteArtist(song._id)} className='p-2 mt-3 rounded bg-red-600'>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>

                <div className="flex justify-center mt-6 space-x-2">
                    <button
                        className="px-3 py-1 bg-[#191919] rounded disabled:opacity-50"
                        onClick={() => {setPage((prev) => Math.max(prev - 1, 1)); scrollToTop()}}
                        disabled={page === 1}
                    >
                        Prev
                    </button>

                    {[...Array(totalPage)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageClick(pageNum)}
                                style={{
                                    fontWeight: page === pageNum ? "bold" : "normal",
                                    margin: "0 5px",
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: page === pageNum ? "#1ED760" : ''
                                }}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    <button
                        className="px-3 py-1 bg-[#191919] rounded disabled:opacity-50"
                        onClick={() => {setPage((prev) => prev + 1); scrollToTop()}}
                        disabled={page === totalPage}
                    >
                        Next
                    </button>
                </div>
            </div>
            {isOpen && modalSong && (
                <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                <div className="bg-[#141414] rounded-lg w-full max-w-md p-6 relative shadow-2xl text-white">
                    <button
                    onClick={() => {
                        if (audioRef.current) audioRef.current.pause();
                        setIsOpen(false);
                        setModalSong(null);
                        setProgress(0);
                        setCurrentTime(0);
                        setIsPlaying(false);
                        setPlayingId(null);
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                    <X size={24} />
                    </button>

                    <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold">{modalSong.title}</h2>
                    <img src={modalSong.coverImage} alt="cover" className="w-40 h-40 mx-auto rounded object-cover" />
                    <h3>{modalSong.title}</h3>
                    <button
                        onClick={handleToggleModalAudio}
                        className="bg-[#1ED760] text-black px-6 py-2 rounded hover:bg-green-600 transition"
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>

                    <div className="w-full mt-4">
                        <input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={(e) => {
                            const newTime = e.target.value;
                            audioRef.current.currentTime = newTime;
                            setCurrentTime(newTime);
                        }}
                        className="w-full accent-green-400"
                        />
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}

export default Songs