import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios'
import { toast } from 'react-toastify'
import { useRef } from 'react'

const Artist = () => {
    const navigate = useNavigate()
    const scrollRef = useRef();
    const [artists, setArtists] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [expandedRows, setExpandedRows] = useState({})
    const limit = 10

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await api.get(`/artist?page=${page}&limit=${limit}`)
                setArtists(res.data.data)
                setTotalPage(res.data.totalPages)
            } catch (err) {
                console.error("Error in fetching artists:", err)
            }
        }
        fetchArtist()
        scrollToTop()
    }, [page])

    const handleDeleteArtist = async (artistId) => {
        const token = localStorage.getItem("accesstoken")
        try {
            await api.delete(`/artist/deleteArtist/${artistId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setArtists((prev) => prev.filter((artist) => artist._id !== artistId));
            toast.success("Artist deleted successfully");
        } catch (err) {
            toast.error("Error deleting artist");
            console.error(err);
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };


    const handlePageClick = (pageNum) => {
        setPage(pageNum);
        scrollToTop()
    }

    const toggleExpand = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }

    return (
        <div className='mt-11 text-white min-h-screen' ref={scrollRef}>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold'>Artist List</h2>
                <button onClick={() => navigate('/admin/addArtist')} className='p-2 bg-blue-500 rounded-md'>
                    Add Artist
                </button>
            </div>

            <table className="min-w-full border-collapse border border-[#191919] mt-3">
                <thead>
                    <tr className="bg-[#1d1d1d] text-left">
                        <th className="border border-[#696969] p-2">Image</th>
                        <th className="border border-[#696969] p-2">Artist</th>
                        <th className="border border-[#696969] p-2">Total Songs</th>
                        <th className="border border-[#696969] p-2">Song Name</th>
                        <th className="border border-[#696969] p-2">Followers</th>
                        <th className="border border-[#696969] p-2">Created Date</th>
                        <th className="border border-[#696969] p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {artists.map(artist => (
                        <tr key={artist._id} className="border-b border-[#191919]">
                            <td className="p-2 border border-[#191919]">
                                <img src={artist.image} className='w-8 h-8 object-cover' alt="" />
                            </td>
                            <td className="p-2 border border-[#191919]">
                                {artist.name}
                            </td>
                            <td className="p-2 border border-[#191919]">
                                {artist.songs.length}
                            </td>
                            <td className="p-2 border border-[#191919]">
                                {expandedRows[artist._id]
                                    ? artist.songs.map(song => (
                                        <span key={song._id}>{song.title},<br /></span>
                                    ))
                                    : artist.songs.slice(0, 1).map(song => (
                                        <span key={song._id}>{song.title}{artist.songs.length > 1 ? '...' : ''}<br /></span>
                                    ))
                                }

                                {artist.songs.length > 1 && (
                                    <button
                                        className="text-blue-400 mt-1 text-xs"
                                        onClick={() => toggleExpand(artist._id)}
                                    >
                                        {expandedRows[artist._id] ? 'See Less' : 'See More'}
                                    </button>
                                )}
                            </td>
                            <td className="p-2 border border-[#191919]">
                                {artist.followers}
                            </td>
                            <td className="p-2 border border-[#191919]">
                                {artist.createdAt.slice(0, 10)}
                            </td>
                            <td className='flex justify-center gap-3'>
                                <button onClick={() => navigate(`/admin/editArtist/${artist._id}`)} className='bg-blue-500 py-1 px-3 rounded mt-1'>
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteArtist(artist._id)} className='bg-red-600 py-1 px-3 rounded mt-1'>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-6 space-x-2">
                <button
                    className="px-3 py-1 bg-[#191919] rounded disabled:opacity-50"
                    onClick={() => {setPage((prev) => Math.max(prev - 1, 1)); scrollToTop}}
                    disabled={page === 1}
                >
                    Prev
                </button>

                {[...Array(totalPage)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum)}
                            style={{
                                fontWeight: page === pageNum ? "bold" : "normal",
                                margin: "0px",
                                padding: '5px 10px',
                                borderRadius: '6px',
                                backgroundColor: page === pageNum ? "#1ED760" : ''
                            }}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    className="px-3 py-1 bg-[#191919] rounded disabled:opacity-50"
                    onClick={() => {setPage((prev) => prev + 1); scrollToTop}}
                    disabled={page === totalPage}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Artist
