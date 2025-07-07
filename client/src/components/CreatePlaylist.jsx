import React, { useState } from 'react';
import {  Pen } from 'lucide-react';


const CreatePlaylist = () => {
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('')

  return (
    <div className="min-h-screen bg-[#121212] rounded-t-md overflow-hidden text-white flex">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-end p-6 bg-[#212121]">
          <div
            className="w-48 h-48 bg-[#121212] flex items-center justify-center mr-6 shadow-xl cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <span className="text-white text-8xl opacity-70">&#9835;</span>
          </div>

          <div className="flex flex-col justify-end text-white cursor-pointer" onClick={() => setShowModal(true)}>
            <p className="text-sm uppercase tracking-wider text-gray-300 mb-1">
              Public Playlist
            </p>
            <h1 className="text-7xl font-bold leading-tight mb-2">
              {playlistName || 'MyPlaylist#1'}
            </h1>
            <p className="text-base text-gray-300">
              Name
            </p>
          </div>
        </div>

        <div className="flex items-center px-6 py-4 bg-[#121212]">
          <button className="text-gray-400 hover:text-white mr-4 text-3xl font-bold">
            ...
          </button>
          <button className="text-gray-400 hover:text-white text-2xl ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="p-6 bg-[#121212]">
          <p className="text-xl text-white mb-4">Let's find something for your playlist</p>
          <div className="flex items-center bg-[#282828] rounded-md max-w-md">
            <input
              type="text"
              placeholder="Search for songs or episodes"
              className="flex-1 bg-transparent border-none outline-none text-white p-1 px-3 text-base placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-transparent  backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] text-white rounded-md w-[550px] h-[400px] p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Edit details</h2>

            <div className="flex space-x-6">
              <div className="relative w-50 h-50 bg-[#282828] flex items-center justify-center">
                <label className=" w-full h-full p-1 cursor-pointer transition-colors">
                    <Pen size={100} className='absolute right-[30%] top-[30%]' />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                    />
                    </label>
              </div>

              <div className="flex flex-col flex-1">
                <input
                  type="text"
                  placeholder="Playlist name"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  
                  className="bg-[#393939] rounded px-3 py-2.5 text-white mb-4 outline-none"
                />
                <textarea
                  placeholder="Add an optional description"
                  className="bg-[#393939]  rounded px-3 py-2 text-white h-35 outline-none"
                />
              </div>
            </div>

            <div className="absolute right-6">
              <button
                className="bg-white text-black font-semibold mt-5 px-6 py-2 rounded-full"
                onClick={() => setShowModal(false)}
              >
                Save
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white text-xl"
              >
              &times;
            </button>
                <div className='absolute bottom-5 text-xs font-bold'>
                    By proceeding, you agree to give spotify access to the image you choose to upload. Please make sure you have the right to upload the image
                </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;
