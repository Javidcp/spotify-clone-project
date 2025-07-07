import React from 'react';
import Spotify from "../assets/downlod-image.png"
import Store from "../assets/microsoft-store.png"
import { Link } from 'react-router-dom';

const Download = () => {
    return (
        <div className="min-h-screen rounded-t-lg overflow-hidden bg-gradient-to-b from-[#5eac96] to-[#f79bd2] flex items-center justify-center px-6 py-10">
        <div className="bg-gradient-to-b from-[#f79bd2] to-[#5eac96] rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
            <div className="flex items-center mb-8">
            <div className="bg-black rounded-full p-2 mr-3">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.062 14.615c-.184.309-.576.405-.868.214-2.377-1.449-5.371-1.779-8.896-.978-.34.077-.683-.132-.758-.472-.075-.34.132-.683.472-.758 3.846-.874 7.191-.496 9.845 1.131.292.184.388.576.205.863zm1.238-2.759c-.23.375-.72.494-1.094.264-2.719-1.674-6.859-2.16-10.082-1.182-.414.124-.851-.111-.975-.525-.124-.414.111-.851.525-.975 3.681-1.118 8.347-.577 11.362 1.324.374.23.493.72.264 1.094zm.106-2.869c-3.26-1.94-8.637-2.118-11.748-1.171-.498.151-1.025-.131-1.176-.629-.151-.498.131-1.025.629-1.176 3.564-1.084 9.518-.877 13.294 1.355.448.265.595.844.329 1.292-.265.448-.844.595-1.328.329z"/>
                </svg>
            </div>
            <span className="text-2xl font-bold text-black">Spotify</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            Download Spotify for Windows
            </h1>

            <p className="text-lg md:text-xl text-black/80 mb-12 leading-relaxed max-w-3xl">
            Enjoy high-quality audio and offline playback, plus Windows Game Bar integration and a 
            friend activity feed that lets you see what your friends are listening to in real time.
            </p>

            <div className="mb-8">
                <a
                    href="https://apps.microsoft.com/detail/9NCBCSZSJRSB?hl=en-us&gl=IN&ocid=pdpshare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black w-fit hover:bg-gray-800 transition-all duration-300 text-white px-8 py-4 rounded-xl flex items-center space-x-3 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <div className="p-1 rounded">
                    <img src={Store} width={50} height={50} alt="" />
                    </div>
                    <div className="text-left">
                    <div className="text-sm text-gray-300">Download from the</div>
                    <div className="font-semibold">Microsoft Store</div>
                    </div>
                </a>
            </div>
            <img src={Spotify} alt="" />
        </div>
        </div>
    );
};

export default Download;