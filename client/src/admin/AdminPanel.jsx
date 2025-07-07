import { useState } from 'react'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

const AdminPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <SideBar  isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <TopBar toggleSidebar={toggleSidebar} />
            <div className={` ${isSidebarOpen === true ? "ml-50" : 'ml-0'} p-6 flex-1`}>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminPanel