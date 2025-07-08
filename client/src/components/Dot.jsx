import React, { useRef, useEffect } from 'react';
import { ChevronRight, Heart, Plus, User, Disc, Share } from 'lucide-react';



const Dropdown = ({ width = 'w-64', position = 'right', isOpen = false,setIsOpen, }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    const handleClick = (fn) => {
        fn();
        setIsOpen(false);
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
        <button
            onClick={() => handleClick(() => console.log('Add to Playlist'))}
            className="w-full flex items-center justify-between px-4 py-2.5 text-white hover:bg-[#191919] transition-colors duration-150 text-left group"
        >
            <div className="flex items-center gap-3">
            <Plus className="w-4 h-4 text-gray-300" />
            <span className="text-sm font-medium">Add to Playlist</span>
            </div>
        </button>
        </div>
    );
};


export default Dropdown;
