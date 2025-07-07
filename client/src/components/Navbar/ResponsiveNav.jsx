import React from 'react'
import { GoHomeFill, GoPlus } from "react-icons/go";
import { IoIosSearch  } from "react-icons/io";
import { useNavigate } from 'react-router-dom';



const ResponsiveNav = () => {
    const navigate = useNavigate()
    return (
        <div className='flex md:hidden fixed z-50 bottom-0 w-full text-white bg-black p-4 justify-around'>
            <button onClick={() => navigate('/')}>
                <GoHomeFill size={20}  />
            </button>
            <button onClick={() => navigate('/search')}>
                <IoIosSearch size={20} />
            </button>
            <button onClick={() => navigate('/createplaylist')}>
                <GoPlus size={20} />
            </button>
        </div>
    )
}

export default ResponsiveNav