import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../utils/axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from 'lucide-react';

const GenrePlaylistCreator = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const navigate = useNavigate()
  const [ opned, setOpened ] = useState(false)
  const [existPlaylist, setExistPlaylist] = useState([])
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const limit = 5
    
  useEffect(() => {
    fetchPlaylists();
  }, [page]);
  const fetchPlaylists = async () => {
      try {
        const res = await api.get(`/genre?page=${page}&limit=${limit}`);
        const serverPlaylists = res.data.data.map((p) => ({
          ...p,
          image: p.image
        }));
        setExistPlaylist(serverPlaylists);
        setTotalPage(res.data.totalPages)
      } catch (err) {
        console.error("Failed to fetch playlists", err);
      }
    };

  const deletePlaylist = async (genreId) => {
    const token = localStorage.getItem('accesstoken')
    try {
        await api.delete(`/deleteGenre/${genreId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setExistPlaylist((prev) => prev.filter((playlist) => playlist._id !== genreId));
      toast.success("Genre deleted successfully");
    } catch (err) {
      toast.error("Error deleting playlist", err);
      console.error("Error deleting playlist", err);
    }
  }



const onSubmit = async (data) => {
  const trimmedName = data.playlistName.trim();

  if (!trimmedName) {
    toast.info("Please enter a valid playlist name.");
    return;
  }

  const formData = new FormData();
  formData.append("name", trimmedName);
  formData.append("description", data.description || "");
  formData.append("image", data.image[0]);

  try {
    const res = await api.post("/genre", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(`Created playlist: ${res.data.playlist.name}`);
    reset();

    fetchPlaylists();
  } catch (error) {
    const message =
      error.response?.data?.message || "Something went wrong!";
    toast.error(`Error: ${message}`);
  }
};

const updateGenre = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      if (editData.newImage) {
        formData.append("image", editData.newImage);
      }

      try {
        await api.put(`/updateGenre/${editData._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Genre updated successfully!");
        fetchPlaylists();
        setEditData(null);
      } catch (err) {
        toast.error("Failed to update genre",err);
      }
    }
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };


    const handlePageClick = (pageNum) => {
        setPage(pageNum);
        scrollToTop()
    }


  return (
    <div className="text-white p-4 mx-auto min-h-screen mt-10">
      {!editData &&
      <>
      {opned && (
        <div
          className={`transition-all duration-500 overflow-hidden ${
            opned ? 'max-h-[1000px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
          }`}
        >
        <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Create Custom Playlist</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-xs bg-[#1e1e1e] p-5 rounded-lg">
        <input
          type="text"
          {...register("playlistName", { required: "Playlist name is required" })}
          placeholder="Enter playlist name"
          className={`w-full border p-2 rounded-md bg-[#1e1e1e] text-white ${
            errors.playlistName ? "border-red-500" : "border-[#696969]"
          }`}
        />
        {errors.playlistName && <p className="text-red-500">{errors.playlistName.message}</p>}

        <input
          type="file"
          accept="image/*"
          className={`text-sm text-[#ccc] bg-[#1e1e1e] rounded-md border p-2 w-full mb-3 ${
            errors.image ? "border-red-500" : "border-[#696969]"
          }`}
          {...register("image", {
            required: "Image is required",
            validate: {
              isImage: (fileList) =>
                fileList &&
                fileList[0] &&
                fileList[0].type.startsWith("image/")
                  ? true
                  : "Only image files are allowed"
            }
          })}
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}

        <textarea
          {...register("description")}
          placeholder="Enter description (optional)"
          className="w-full border p-2 rounded-md bg-[#1e1e1e] text-white border-[#696969]"
        />

        <button
                type="submit"
                disabled={isSubmitting}
                className={`p-3 mt-2 font-mono rounded-lg w-full ${
                    isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-400 text-black hover:bg-green-300"
                }`}
            >
            {isSubmitting ? "Creating..." : "Create Playlist"}
            </button>
      </form>
        </div>
        </div>
      )}
      

      <div className="">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Playlists</h3>
          {!opned ? (
            <button onClick={() => setOpened(true)} className="bg-blue-500 p-3 rounded transition duration-1000 hover:bg-blue-600">
              Create Playlist
            </button>
          ) : (
            <button onClick={() => setOpened(false)}  className={`transition-transform bg-[#191919] p-1 rounded duration-1000 ${opned ? 'rotate-0' : 'rotate-90'}`} >
              <ChevronUp size={30}/>
            </button>
          )}
        </div>
        {existPlaylist.length === 0 ? (
          <p className="text-gray-400">No playlists created yet.</p>
        ) : (
          <div className="ml-0 mt-4 w-full space-y-4">
            {existPlaylist.map((p, i) => (
              <Link
                key={i}
                className="flex items-center gap-4 p-4 rounded-md bg-[#121212] border border-[#696969]"
              >
                <div className="flex justify-between w-full">
                  <div onClick={() => navigate(`/admin/genre/${p._id}`)} className="flex">
                    <div className="w-20 h-20 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 ml-2 flex flex-col justify-center">
                    <h4 className="text-xl font-semibold">{p.name}</h4>
                    <p className="text-sm text-gray-400">
                      {p.description || "No description provided."}
                    </p>
                  </div>
                  </div>
                <div className=" gap-2 flex h-fit">
                    <button onClick={() => setEditData(p)}  className="bg-blue-600 p-2 px-5 rounded">
                      Edit
                    </button>
                    <button onClick={() => deletePlaylist(p._id)} className="bg-red-600 p-2 px-3 rounded">
                      Delete
                    </button>
                </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
                <button
                    className="px-3 py-1 bg-[#191919] rounded disabled:opacity-50"
                    onClick={() => {setPage((prev) => Math.max(prev - 1, 1)); scrollToTop()}}
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
                    onClick={() => {setPage((prev) => prev + 1); scrollToTop()}}
                    disabled={page === totalPage}
                >
                    Next
                </button>
            </div>
      </>
      }

      
      {editData && (
        <form
          onSubmit={updateGenre}
          className="bg-[#1e1e1e] p-5 mt-4 max-w-xs rounded-lg"
        >
          <h3 className="text-lg mb-2">Edit Playlist</h3>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full mb-2 p-2 rounded-md bg-[#1e1e1e] text-white border border-[#696969]"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full mb-2 p-2 rounded-md bg-[#1e1e1e] text-white border border-[#696969]"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditData({ ...editData, newImage: e.target.files[0] })}
            className="w-full mb-2 p-2 text-sm bg-[#1e1e1e] text-[#ccc] border border-[#696969] rounded-md"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-black p-2 rounded">Update</button>
            <button onClick={() => setEditData(null)} type="button" className="bg-gray-600 p-2 rounded">Cancel</button>
          </div>
        </form>
      )}

    </div>
  );
};

export default GenrePlaylistCreator;
