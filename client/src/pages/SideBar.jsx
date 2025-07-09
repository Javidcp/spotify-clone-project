import React, { useEffect, useState } from 'react'
import { GoPlus } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Heart } from "lucide-react"
import useAuth from '../hooks/useAuth';

const SideBar = () => {
    const [full, setFull] = useState(false)
    const navigate = useNavigate()
    const [ likes, setLikes ] = useState([])
    const { isAuthenticated, user } = useAuth()
    const [ playlists, setPlaylists ] = useState([])
    const userId = user?._id

    useEffect(() => {
    if (!userId) {
        setLikes([]);
        setPlaylists([]);
    }
}, [userId]);


    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        if (!userId) return;
        const fetchSongs = async () => {
            try {
                const { data } = await api.get(`/likedsongs`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLikes(data)
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchSongs()
    }, [userId])

    useEffect(() => {
        if (!userId) return;
        const fetchPlaylist = async () => {
            try{
                const res = await api.get(`/user-playlist/${userId}`)
                setPlaylists(res.data.playlists)
            } catch (err) {
                console.error("Error to fetching playlist:", err.message)
            }
        }
        fetchPlaylist()
    }, [userId])

    return (
        <div className={`bg-[#121212] rounded-lg h-[100%] hidden m-1 px-3 pt-5 text-white md:flex flex-col gap-4 ${full === true ? 'items-start pl-[20px] w-100 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]' : 'items-center transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]'} `}>
            <div className='flex items-center justify-between w-full'>
                <div className={`${full ? '': 'flex-col'}flex items-center gap-2`}>
                    <button onClick={() => setFull(prev => !prev)}>
                        <svg role="img" height={25} width={25} color='#9a9a9a' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.5 2.134a1 1 0 011 0l6 3.464a1 1 0 01.5.866V21a1 1 0 01-1 1h-6a1 1 0 01-1-1V3a1 1 0 01.5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zm6 0a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1z" fill="currentColor"></path></svg>
                    </button>
                    {!full && likes.length < 0 && (
                        <button onClick={() => navigate('/createplaylist')} className='block mt-4 text-[#9a9a9a]'>
                            <GoPlus size={25} />
                        </button>
                    )}
                    {full && (
                        <span className="text-lg font-bold">Your Library</span>
                    )}
                </div>
                {full && (
                    <button onClick={() => navigate('/createplaylist')}  className="flex items-center gap-1 text-sm font-semibold text-[#9a9a9a] hover:text-white">
                        <GoPlus size={25} />
                        Create
                    </button>
                )}
            </div>
            
            {(likes.length < 0 || !isAuthenticated) && full && (
                <>
                    <div className='bg-[#242424] rounded-lg p-4 w-full'>
                        <h3 className='text-white font-bold text-base mb-2'>Create your first playlist</h3>
                        <p className='text-[#b3b3b3] text-sm mb-4'>It's easy, we'll help you</p>
                        <button onClick={() => navigate('/createplaylist')} className='bg-white text-black text-sm font-semibold py-2 px-4 rounded-full hover:scale-105 transition-transform duration-200'>
                            Create playlist
                        </button>
                    </div>

                    <div className='bg-[#242424] rounded-lg p-4 w-full'>
                        <h3 className='text-white font-bold text-base mb-2'>Let's find some podcasts to follow</h3>
                        <p className='text-[#b3b3b3] text-sm mb-4'>We'll keep you updated on new episodes</p>
                        <button onClick={() => navigate('/search')} className='bg-white text-black text-sm font-semibold py-2 px-4 rounded-full hover:scale-105 transition-transform duration-200'>
                            Browse podcasts
                        </button>
                    </div>
                </>
            )}
            { likes.length > 0 && (
                <div onClick={() => navigate('/liked')} className='flex gap-4 mt-5'>
                    <div className="relative w-10 h-10  bg-gradient-to-br from-indigo-700 to-purple-700 rounded-lg flex items-center justify-center shadow-2xl">
                        <Heart className="w-4 h-4 text-white" fill="white" />
                    </div>
                    {full && 
                        <div>
                            <p className='text-sm'>Liked Songs</p>
                            <span className='text-xs'>{likes.length}</span>
                        </div>
                    }
                </div>
            )}

            {!full && playlists.map((p) => (
                <div 
                    key={p._id} 
                    onClick={() => navigate(`/createdplaylist/${p._id}`)} 
                    className='flex items-center gap-4 cursor-pointer hover:bg-[#242424] rounded-md w-full'
                >
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    
                </div>
            ))}


{full && playlists.map((p) => (
    <div 
        key={p._id} 
        onClick={() => navigate(`/createdplaylist/${p._id}`)} 
        className='flex items-center gap-4 cursor-pointer hover:bg-[#242424] rounded-md w-full'
    >
        <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
        <span className='text-sm'>{p.name}</span>
    </div>
))}

            
        </div>
    )
}

export default SideBar;