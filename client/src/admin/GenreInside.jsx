import React, { useEffect, useState, useRef } from 'react'
import api from '../utils/axios'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { Play, Pause } from 'lucide-react';

const GenreInside = () => {
    const { id } = useParams()
    const [ genre, setGenre ] = useState(null)
    const audioRef = useRef(null);
    const [playingId, setPlayingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const fetchSongs = async () => {
            try{
                const res = await api.get(`/genre-playlists/${id}`)
                setGenre(res.data)
            } catch (err) {
                toast.error("Error fetching songs:", err)
            }
        }
        fetchSongs()
    }, [id])



    const handleTogglePlay = (songUrl, songId) => {
        if (audioRef.current && playingId === songId) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(songUrl);
            audioRef.current.play();
            setPlayingId(songId);
            setIsPlaying(true);
        }
    };

    if (!genre) return <div>Loading...</div>;

    return (
        <div className="p-4 min-h-screen mt-10 text-white grid grid-cols-2 gap-10">
            <div className='sticky top-20 self-start'>
                <img src={genre.image} className='rounded' alt="" />
            </div>
            <div>
                <div className='border p-5 border-[#696969] rounded-md bg-[#121212]'>
                    <h2 className="text-5xl font-bold mb-4">{genre.name}</h2>
                    <p className="mb-2">{genre.description}</p>
                </div>
                    <h2 className='text-xl font-bold mt-8 mb-3'>Song List :</h2>
                

                    <ul className="space-y-2 p-2">
                    {genre.songs && genre.songs.length === 0 ? (
                        <li>No Song Found</li>
                    ) : (
                        genre.songs && genre.songs.map(song => (
                            <li key={song._id} className="border p-2 rounded shadow border-[#696969] bg-[#1e1e1e] gap-5 flex justify-between">
                                <div className='flex gap-2'>
                                    <img src={song.coverImage} className='w-12 object-cover' alt={song.name} />
                                    <div className='space-y-1'>
                                        <p className="font-semibold">{song.title}</p>
                                        <p className="text-sm text-[#696969]">Artist: {song.artist?.map(a => a.name).join(", ") || 'Unknown'}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleTogglePlay(song.url, song._id)} className='bg-green-500 py-2 px-3 rounded-full'>
                                    {(playingId === song._id && isPlaying) ? <Pause/> : <Play/>}
                                </button>
                            </li>
                        ))
                    )}
                </ul>
                
            </div>
        </div>
    )
}

export default GenreInside