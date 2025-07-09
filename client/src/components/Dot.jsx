import React, { useRef, useEffect, useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../utils/axios'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ width = 'w-64', position = 'right', isOpen = false, setIsOpen, song }) => {
    const dropdownRef = useRef(null);
    const [playlists, setPlaylists] = useState([]);
    const userId = useSelector((state) => state.auth.user?._id);
    const songId = song.id
    const navigate = useNavigate()
    

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    useEffect(() => {
        if (isOpen && userId) {
        api.get(`/user-playlist/${userId}`)
            .then(res => setPlaylists(res.data.playlists))
            .catch(err => toast.error(err.response?.data?.message || 'Failed to load playlists'));
        }
    }, [isOpen, userId]);

    const handleToggleSong = async (playlist) => {
        const exists = playlist.songs.includes(songId);

        try {
            if (exists) {
                await api.post('/playlist/remove-song', { playlistId: playlist._id, songId });

                setPlaylists(prev =>
                    prev.map(p =>
                        p._id === playlist._id
                            ? { ...p, songs: p.songs.filter(id => id !== songId) }
                            : p
                    )
                );

                toast.info('Song removed from playlist');
            } else {
                await api.post('/playlist/add-song', { playlistId: playlist._id, songId });

                setPlaylists(prev =>
                    prev.map(p =>
                        p._id === playlist._id
                            ? { ...p, songs: [...p.songs, songId] }
                            : p
                    )
                );

                toast.success('Song added to playlist');
            }

            setIsOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update playlist');
        }
    };

    const positionClasses = {
        left: 'left-0',
        right: 'right-0',
        center: 'left-1/2 transform -translate-x-1/2',
    };

    if (!isOpen) return null;

    return (
        <div
        ref={dropdownRef}
        className={`absolute top-full mt-2 ${width} ${positionClasses[position]} bg-[#1e1e1e] rounded-lg shadow-xl py-2 z-50`}
        >
        {playlists.length > 0 ? (
playlists.map((playlist) => (
    <button
        key={playlist._id}
        onClick={() => handleToggleSong(playlist)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-white hover:bg-[#191919] transition-colors duration-150 text-left group"
    >
        <div className="flex items-center gap-3">
            <Plus className={`w-4 h-4 ${playlist.songs.includes(songId) ? 'text-green-400' : 'text-gray-300'}`} />
            <span className="text-sm font-medium">{playlist.name}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
    </button>
))

        ) : (
            <button onClick={() => navigate('/createplaylist')} className="w-full flex items-center justify-between px-4 py-2.5 text-white hover:bg-[#191919] transition-colors duration-150 text-left group">
                <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-gray-300" />
                <span className="text-sm font-medium">Create Playlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
        )}
        </div>
    );
};

export default Dropdown;
