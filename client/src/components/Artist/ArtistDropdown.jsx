import React, { useRef, useEffect } from 'react';
import { ChevronRight, Heart, Plus, ListMusic, Radio, User, Disc, FileText, Image, Share, Ban  } from 'lucide-react';

const defaultItems = [
    { label: "Follow", icon: User },
    { label: "Don't play this artist", icon: Ban  },
    { label: "Go to artist radio", icon: Disc },
    { label: "Share", icon: Share },
];

const ArtistDropdown = ({
        width = 'w-64',
        position = 'right',
        isOpen = false,
        setIsOpen,
        onItemClick
    }) => {
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

    const handleItemClick = (item, index) => {
        if (onItemClick) onItemClick(item, index);
        setIsOpen(false);
    };

    const positionClasses = {
        left: 'left-0',
        right: 'right-0',
        center: 'left-1/2 transform -translate-x-1/2'
    };

    if (!isOpen) return null;

return (
        <div
        ref={dropdownRef}
        className={`absolute top-full mt-5 left-[-45px] ${width} ${positionClasses[position]} bg-[#1e1e1e] rounded-lg shadow-xl py-2 z-50`}
        >
        {defaultItems.map((item, index) => (
            <button
            key={index}
            onClick={() => handleItemClick(item, index)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-white hover:bg-[#191919] transition-colors duration-150 text-left group"
            >
            <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gray-300" />
                <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.hasSubmenu && (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            )}
            </button>
        ))}
        </div>
    );
};

export default ArtistDropdown;
