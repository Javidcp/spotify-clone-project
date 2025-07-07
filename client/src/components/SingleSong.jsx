/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Play, Pause, Shuffle, Plus, Download, MoreHorizontal, Clock, List } from 'lucide-react';
import { usePlayer } from '../hooks/redux';
import api from '../utils/axios';
import { useParams } from 'react-router-dom';
import BottomPlayer from './Player';
import LikeButton from './LikkedButton';



export default function SingleSong( ) {
const {
  currentTrackId,
  currentPlaylistId,
  currentTrackIndex,
  isPlaying,
  playTrack,
  playPause,
  switchPlaylist,
  currentTrack,
  formatTime,
  currentTime,
  duration,
} = usePlayer();


  const { songId } = useParams();
  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await api.get(`/songs/${songId}`);
        setSongData(res.data);
      } catch (err) {
        console.error('Error fetching song:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [songId]);;

const handlePlay = () => {
  if (!songData) return;

  const playlistId = `single-${songData._id}`;
  const songObj = {
    ...songData,
    id: songData._id,
    audioUrl: songData.audioUrl || songData.url,
  };

  const songList = [songObj];

  if (currentPlaylistId !== playlistId) {
    switchPlaylist(playlistId, songList);
    setTimeout(() => {
      playTrack(songData._id, 0); 
    }, 100);
  } else {
    if (currentTrackId === songData._id) {
      playPause();
    } else {
      playTrack(songData._id, 0);
    }
  }
};


const isCurrentSongPlaying = songData && currentTrack?._id === songData._id && isPlaying;

if (loading) {
  return <div className="text-white p-8">Loading...</div>;
}

if (!songData) {
  return <div className="text-white p-8">Song not found</div>;
}

  return (
    <div className={`bg-[#121212]  text-white`}>
      <div className="flex items-end p-8 pb-6 bg-[#234e21]">
        <div className="w-60 h-60 mr-6 shadow-2xl">
          <img 
            src={songData.coverImage} 
            alt={`${songData.title} cover`} 
            className="w-full h-full object-cover rounded shadow-lg"
            onError={(e) => { e.target.src = '/api/placeholder/240/240'; }}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium mb-2">{songData.type}</p>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            {songData.title}
          </h1>
          <div className="flex items-center text-sm text-gray-300 flex-wrap">
            {songData.artist.map((artist, i) => (
              <span key={artist._id || i}>
                <span className={i === 0 ? "font-medium text-white" : ""}>
                  {artist.name}
                </span>
              </span>
            ))}
            <span className="mx-1">•</span>
            <span>{songData.createdAt.slice(0,4)}</span>
            <span className="mx-1">•</span>
            <span>1 song - {songData.duration}</span>
          </div>
        </div>
      </div>

      <div className="px-8 py-3 sticky top-[-5px] bg-gradient-to-b from-[#234e21] to-[#234e21]/80">
        <div className="flex items-center gap-6">
          <button
            onClick={handlePlay}
            className="bg-green-500 hover:bg-green-400 transition-colors rounded-full p-4"
            disabled={!songData.url}
          >
            {isCurrentSongPlaying ?
              <Pause className="w-6 h-6 text-black fill-black" /> :
              <Play className="w-6 h-6 text-black fill-black ml-1" />
            }
          </button>

            

          <button className="text-gray-400 hover:text-white transition-colors">
            <Download className="w-6 h-6" />
          </button>

          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-8">
        <div className="flex items-center justify-between py-2 border-b border-gray-700 mb-2">
          <div className="flex items-center text-gray-400 text-sm">
            <span className="w-8 text-center"></span>
            <span className="ml-4">Title</span>
          </div>
          <div className="flex items-center gap-8">
            {/* <span className="text-gray-400 text-sm">Plays</span> */}
            <Clock className="w-4 h-4 text-gray-400" />
            <span></span>
            <span></span>
            <List className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center justify-between py-6 px-2 rounded hover:bg-[#191919] hover:bg-opacity-10 transition-colors group">
          <div className="flex items-center flex-1 ">
            <div className="w-8 text-center">
              <button
                onClick={handlePlay}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isCurrentSongPlaying ?
                  <Pause className="w-4 h-4 text-white fill-white" /> :
                  <Play className="w-4 h-4 text-white fill-white" />
                }
              </button>
            </div>

            <div className="ml-4 flex items-center">
              <img
                src={songData.coverImage}
                alt={`${songData.title} thumbnail`}
                className="w-10 h-10 rounded mr-3 object-cover"
                onError={(e) => { e.target.src = '/api/placeholder/40/40'; }}
              />
              <div>
                <div className="text-white font-medium">{songData.title}</div>
                <div className="text-gray-400 text-sm">{songData.artist.map(a => a.name)}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-gray-400 text-sm">{songData.duration}</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              {/* <Plus className="w-4 h-4 text-gray-400 hover:text-white" /> */}
              <LikeButton song={songData} />
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
            
          </div>
        </div>
      </div>
      {currentTrack && (
        <BottomPlayer
            songs={songData}
            currentTrackId={currentTrackId}
            currentTrackIndex={currentTrackIndex}
            isPlaying={isPlaying}
            handlePlay={handlePlay}
        />
      )}
    </div>
  );
}
