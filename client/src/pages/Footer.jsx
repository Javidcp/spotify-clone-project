import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const navigate = useNavigate()

    return (
        <div className=" text-white bg-[#121212] rounded-b-lg hidden sm:flex flex-col justify-end">
            <footer className=" pt-10 pb-8 px-8">
            <div className="border-t border-zinc-800 mb-15"></div>
                <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-8 mb-16">
                    <div>
                    <h3 className="text-white font-semibold text-base mb-4">Company</h3>
                    <ul className="space-y-3">
                        <li>
                        <a href="https://www.lifeatspotify.com/#_gl=1*1z0ewvu*_gcl_au*MTIwMTA4OTA3NS4xNzQ4NTg3NDUz" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            Jobs
                        </a>
                        </li>
                        <li>
                        <a href="https://newsroom.spotify.com/#_gl=1*12pz50n*_gcl_au*MTIwMTA4OTA3NS4xNzQ4NTg3NDUz" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            For the Record
                        </a>
                        </li>
                    </ul>
                    </div>

                    <div>
                    <h3 className="text-white font-semibold text-base mb-4">Communities</h3>
                    <ul className="space-y-3">
                        <li>
                        <a href="https://artists.spotify.com/home" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            For Artists
                        </a>
                        </li>
                        <li>
                        <a href="https://ads.spotify.com/en-IN/" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            Advertising
                        </a>
                        </li>
                        <li>
                        <a href="https://investors.spotify.com/home/default.aspx" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            Investors
                        </a>
                        </li>
                        <li>
                        <a href="https://spotifyforvendors.com/" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            Vendors
                        </a>
                        </li>
                    </ul>
                    </div>

                    <div>
                    <h3 className="text-white font-semibold text-base mb-4">Useful links</h3>
                    <ul className="space-y-3">
                        <li>
                        <a href="https://support.spotify.com/in-en/" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            Support
                        </a>
                        </li>
                        <li>
                        <a href="https://www.spotify.com/in-en/free/" target='_blank' className="text-gray-400 hover:text-white text-sm transition-colors">
                            Free Mobile App
                        </a>
                        </li>
                    </ul>
                    </div>

                    <div>
                    <h3 className="text-white font-semibold text-base mb-4">Spotify Plans</h3>
                    <ul className="space-y-3">
                        <li>
                        <button onClick={() => navigate('/premium')} className="text-gray-400 hover:text-white text-sm transition-colors">
                            Premium Individual
                        </button>
                        </li>
                        <li>
                        <button onClick={() => navigate('/premium')} className="text-gray-400 hover:text-white text-sm transition-colors">
                            Premium Duo
                        </button>
                        </li>
                        <li>
                        <button onClick={() => navigate('/premium')} className="text-gray-400 hover:text-white text-sm transition-colors">
                            Premium Family
                        </button>
                        </li>
                        <li>
                        <button onClick={() => navigate('/premium')} className="text-gray-400 hover:text-white text-sm transition-colors">
                            Premium Student
                        </button>
                        </li>
                    </ul>
                    </div>

                    <div className="flex justify-center  w-full  ">
                    <div className="flex space-x-4">
                        <a href="https://www.instagram.com/spotify/"  target='_blank' className="w-10 h-10 bg-[#1d1d1d] rounded-full flex items-center justify-center hover:bg-[#252525] transition-colors" aria-label="Instagram" >
                        <Instagram size={18} className="text-white" />
                        </a>
                        <a 
                        href="https://x.com/spotify"  target='_blank' className="w-10 h-10 bg-[#1d1d1d] rounded-full flex items-center justify-center hover:bg-[#252525] transition-colors" aria-label="Twitter" >
                        <Twitter size={18} className="text-white" />
                        </a>
                        <a href="https://www.facebook.com/SpotifyIndia/?brand_redir=6243987495#"  target='_blank' className="w-10 h-10 bg-[#1d1d1d] rounded-full flex items-center justify-center hover:bg-[#252525] transition-colors" aria-label="Facebook" >
                        <Facebook size={18} className="text-white" />
                        </a>
                    </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mb-8"></div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                    
                    </div>

                    <div className="text-gray-400 text-sm">
                    © 2025 Spotify AB
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;