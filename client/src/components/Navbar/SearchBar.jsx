import { useEffect, useState } from "react";
import { IoIosFolderOpen, IoIosSearch  } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentTrack, setIsPlaying } from "../../redux/playerSlice"; 



const SearchBar =() => {
    const navigate = useNavigate()
    const [ search, setSearch ] = useState('')
    const [ results, setResult ] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        if (search.trim() === "") return setResult([]);

        const fetchSearch = async () => {
            try {
                const res = await api.get(`/search/all?q=${search}`);

                setResult([ ...res.data.artists, ...res.data.songs, ...res.data.genres ])
            } catch (err) {
                toast.error("Error in fetching detail:", err)
            }
        }
        fetchSearch()
    }, [search])

    return (
        <div className="relative">
            <div className="flex relative items-center bg-zinc-900 text-white rounded-full px-4 py-2   h-12">
                <IoIosSearch  className="text-zinc-400" size={28} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="What do you want to play?"
                    className="bg-transparent outline-none border-none text-sm placeholder-zinc-400 ml-3 flex-grow"
                />
                <button onClick={() => navigate('/search')} className="hidden md:block">
                    <IoIosFolderOpen className="text-white cursor-pointer border-l-1 pl-2" size={25} />
                </button>
            </div>
            <ul className="z-50 absolute left-0 top-14 text-white font-[400]  w-full bg-[#1d1d1d] rounded-md flex flex-col gap-2 overflow-y-auto">
                {results.map((item, index) => (
                    <Link   to={ item.type === 'artist'? `/artist/${item._id}` : item.type === 'genre' ? `/playlist/${item._id}` : item.type === 'song' ? `/song/${item._id}`: '/'} key={index} onClick={() => {setSearch(''); if (item.type === 'song') { dispatch(setCurrentTrack(item)); dispatch(setIsPlaying(true)) }}} className="px-2 flex items-center gap-4 pb-1">
                        <img src={item.image || item.coverImage} className={`w-10 object-cover h-10 ${item.type === 'artist' && ('rounded-full')}`} alt="" />
                        <div>
                            <p>{item.name || item.title}</p>
                            <div>
                                {item.type === 'artist' && (
                                    <p>Artist</p>
                                )}
                                {item.type === 'song' && (
                                    <p>{item.artist?.map(a => a.name) || "Unknown"}</p>
                                )}
                                {item.type === 'genre' && (
                                    <p>{item.name}</p>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default SearchBar