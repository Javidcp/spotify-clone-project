import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const BrowseInterface = () => {
    const [playlist , setPlaylist] = useState([])

    useEffect(() => {
        const handleSongs = async () => {
            try {
                const res = await api.get('/genre')
                const colorData = res.data.playlists.map(item => ({
                    ...item,
                    bgColor: getRandomColor()
                }))
                setPlaylist(colorData)
                console.log(res.data);
                
            } catch (err) {
                toast.error("Error in fetching Playlist:", err)
            }
        }
        handleSongs()
    }, [])

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6">
            <span className='block md:hidden mb-4'>
                <SearchBar className="bg-amber-200"/>
            </span>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Browse all</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {playlist.map((category) => (
                        <Link to={`/playlist/${category._id}`} key={category._id}  className={`rounded-lg  p-6 h-40 relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105  hover:shadow-2xl group`} style={{ backgroundColor: category.bgColor}}>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold mb-2 text-white drop-shadow-lg">
                                {category.name}
                            </h2>
                        </div>
                            <img src={category.image} className='w-30 absolute right-[-30px] rounded-md bottom-[-20px] rotate-45' alt="" />
                        </Link>
                    ))}
                </div>
                
            </div>
        </div>
    );
};

export default BrowseInterface;