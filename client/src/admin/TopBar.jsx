import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/authSlice'
import { IoIosLogOut, IoIosMenu } from "react-icons/io";

const TopBar = ({ toggleSidebar }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        dispatch(logout());
        navigate("/");
    };
    return (
        <div className="fixed p-3 shadow bg-[#181818] text-white flex justify-between w-full z-20">
            <button className=" ml-4 text-2xl" onClick={toggleSidebar}><IoIosMenu /></button>
            <button className="  flex border pt-1 pb-2 px-3 rounded cursor-pointer hover:bg-red-600 hover:border-0 " onClick={handleLogout}>Logout &nbsp;<IoIosLogOut size={20} className="mt-1" /></button>
        </div>
    )
}

export default TopBar