import React from 'react'
import Logo from "../../assets/spotify_icon-white.png"
import { GoHomeFill } from "react-icons/go";
import SearchBar from './SearchBar';
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Profile from './Profile';
import { logout } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, ChevronRight, ChevronLeft } from 'lucide-react';




const Navbar = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate()
    const notifications = useSelector((state) => state.notifications.items);
    const unreadCount = notifications.filter(n => !n.isRead).length;


    const isLogged = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);




    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        dispatch(logout());
        navigate("/");
    };
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className='h-16 pl-7 bg-black flex items-center justify-between'>
            <div className="flex items-center">
                <img src={Logo} className='w-8 h-8' alt="" />
                {isLogged && user && (
                    <div className='flex gap-1.5 ml-3'>
                        <button onClick={() => navigate(-1)} className='text-white p-2 bg-[#1e1e1e] rounded-full'>
                            <ChevronLeft size={30} />
                        </button>
                        <button onClick={() => navigate(1)} className='text-white p-2 bg-[#1e1e1e] rounded-full'>
                            <ChevronRight size={30} />
                        </button>
                    </div>
                )}
                <button onClick={() => navigate('/')} className='bg-[#1F1F1F] text-white p-[10px] cursor-pointer ml-6 mr-2 hidden md:block rounded-full'>
                    <GoHomeFill size={28}  />
                </button>
                <span  className="hidden md:block w-[400px]">
                    <SearchBar />
                </span>
            </div>
                <div className='flex items-center gap-5'>
                { !isLogged && !user && (
                    <div className="hidden md:flex text-zinc-400 " style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>
                        <>
                            <div className={`px-3 mr-2 flex gap-2 border-r-1`}>
                                <Link to='/premium'>Premium</Link>
                                <Link to='https://www.spotify.com/in-en/download/windows/' target='_blank'>Download</Link>
                            </div>
                        </>
                        <div>
                            <Link to='/download' className='flex items-center gap-2 mx-3'>
                                <MdOutlineDownloadForOffline size={20} />
                                Install App
                            </Link>
                        </div>
                    </div>
                )}
            { !isLogged && !user ? (
                <div className='flex items-center gap-4'>
                    <Link to='/signup' className='text-zinc-400 block' style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>Sign up</Link>
                    <button onClick={() => navigate('/login')} className='h-10 w-20 md:h-12 md:w-28 mr-2 rounded-full bg-white flex items-center justify-center' style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>
                        Log in
                    </button>
                </div>
            ) : (
                <>
                    <div className='flex items-center mr-1 gap-3'>
                        <button onClick={() => navigate('/premium')} className='bg-white py-2 px-4 rounded-full cursor-pointer'>
                            Explore Premium
                        </button>
                        <button onClick={() => navigate('/notification')} className='relative'>
                            <Bell size={20} className='text-[#818181]' />
                            {unreadCount > 0 &&<span className='bg-green-400 absolute top-[-6px]  w-4 h-4 rounded-full text-[10px]'>{unreadCount}</span>}
                        </button>
                        <div className='relative'>
                            <button onClick={toggleDropdown} className="w-full flex items-center  cursor-pointer  justify-center transition-all duration-200 transform hover:scale-105 " >
                                <Profile/>
                            </button>
                            <div
                                className={`absolute top-full w-[200px] z-40 right-0 mt-0 text-white bg-[#1f1f1f] rounded-lg shadow-xl overflow-hidden transition-all duration-200 transform origin-top ${
                                isOpen
                                    ? 'opacity-100 scale-100 translate-y-0'
                                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                }`}
                            >
                                <div className="py-2">
                                    <button
                                        onClick={() => navigate('/account')}
                                        className="flex text-center w-[100%] px-4 py-3 hover:bg-[#444444]  transition-colors duration-150"
                                    >
                                        View Profile
                                    </button>
                                    <button onClick={handleLogout} className="flex text-center w-[100%] px-4 py-3 hover:bg-[#444444] transition-colors duration-150">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            </div>
        </div>
    )
}

export default Navbar