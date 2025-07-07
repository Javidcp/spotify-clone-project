import { MdDashboard, MdMicExternalOn  } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { ListMusic  } from "lucide-react"
import { useLocation, Link } from 'react-router-dom';
import Logo from "../assets/spotify-logo-full.png"

const SideBar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    return (
        <div className={`fixed top-0 left-0 h-screen p-5 z-30 transition-transform transform  bg-[#181818] text-white ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <button className="text-2xl mb-5 block text-gray-400" onClick={toggleSidebar}>&times;</button>
            <img src={Logo} width={120} className='mb-5' alt="Logo" />
            
            <ul>
                <li className="mb-3">
                    <Link to="/admin/dashboard" className={`flex gap-2 p-2 rounded ${location.pathname === "/admin/dashboard" ? "bg-gray-200 pl-5 text-black" : "hover:text-[#696969]"}`}>
                        <MdDashboard className="mt-1" />Dashboard
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/users" className={`gap-2 p-2 rounded flex  ${location.pathname.startsWith("/admin/users") ? "bg-gray-200 pl-5 text-black" : "hover:text-[#696969]"}`}>
                        <FaUser className="mt-1" />Users
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/songs" className={`flex gap-2 p-2 rounded ${location.pathname.startsWith("/admin/songs") ? "bg-gray-200 pl-5 text-black" : "hover:text-gray-400"}`}>
                        <IoMusicalNotesSharp className="mt-1" />Songs
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/artist" className={`flex gap-2 p-2 rounded ${location.pathname.startsWith("/admin/artist") ? "bg-gray-200 pl-5 text-black" : "hover:text-gray-400"}`}>
                        <MdMicExternalOn  className="mt-1" />Artist
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/genre" className={`flex gap-2 p-2 rounded ${location.pathname.startsWith("/admin/genre") ? "bg-gray-200 pl-5 text-black" : "hover:text-gray-400"}`}>
                        <ListMusic className="mt-1" size={18} />Genre Playlist
                    </Link>
                </li>
                <li className="mb-3">
                    <Link to="/admin/coupon" className={`flex gap-2 p-2 rounded ${location.pathname.startsWith("/admin/coupon") ? "bg-gray-200 pl-5 text-black" : "hover:text-gray-400"}`}>
                        <ListMusic className="mt-1" size={18} />Coupon
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default SideBar