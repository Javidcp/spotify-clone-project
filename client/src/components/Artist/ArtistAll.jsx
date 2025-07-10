import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../hooks/redux';
import BottomPlayer from '../Player';

const SpotifyArtist = () => {
    const [artists, setArtist] = useState([])
    const { currentTrackId } = usePlayer()

    useEffect(() => {
        const handleArtists = async () => {
            try {
                const res = await api.get('/artist')
                setArtist(res.data.data)
                
            } catch (err) {
                toast.error("Error in fetching Playlist:", err)
            }
        }
        handleArtists()
    }, [])

    return (
        <div className="bg-[#121212] text-white p-6  mb-10 sm:mb-0">
            <div className="w-full mx-auto">
                <div className="mb-6">
                    <h1 className="md:text-3xl text-sm font-bold mb-2">Popular Artists</h1>
                    <p className="text-gray-400 text-xs sm:text-md ">Artists you might like</p>
                </div>
                <div
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4  scroll-smooth pb-4 "
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {artists.map((artist) => (
                    <Link
                        to={`/artist/${artist._id}`}
                        key={artist._id}
                        className="flex-shrink-0 w-50 hover:bg-[#1d1d1d] rounded-lg p-4 transition-all duration-300 cursor-pointer group/card"
                    >
                        <div className="relative mb-4">
                            <img
                                src={artist.image}
                                alt={artist.name}
                                className="w-20 sm:w-full aspect-square object-cover rounded-full"
                            />
                            
                        </div>
                        
                        <div className="">
                            <h3 className="md:text-md text-xs mb-2 truncate">{artist.name}</h3>
                            <p className="text-gray-400 text-sm">Artist</p>
                        </div>
                    </Link>
                    ))}
                </div>
            </div>
            {currentTrackId && <BottomPlayer/>}
        </div>
    );
};

export default SpotifyArtist;