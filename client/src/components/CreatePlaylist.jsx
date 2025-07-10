import React, { useState } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const CreatePlaylist = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm();
  const [showModal, setShowModal] = useState(false);
  
  const playlistName = watch('playlistName')?.trim() || '';
  const userId = useSelector((state) => state.auth.user?._id);
  console.log(userId, 'gg');
  


  const onSubmit = async (data) => {
    const trimmedName = data.playlistName.trim();

    if (!trimmedName) {
      toast.info("Please enter a valid playlist name.");
      return;
    }

    if (!data.image || !data.image[0]) {
      toast.info("Please select an image for the playlist.");
      return;
    }

    const formData = new FormData();
    formData.append("name", trimmedName);
    formData.append("description", data.description || "");
    formData.append("image", data.image[0]);
    formData.append("userId", userId);

    try {
      const res = await api.post("/playlist", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Created playlist: ${res.data.playlists.name}`);
      reset();
      setShowModal(false);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong!";
      toast.error(`Error: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] rounded-t-md overflow-hidden text-white flex flex-col md:flex-row">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-end p-6 bg-[#212121] cursor-pointer" onClick={() => setShowModal(true)}>
          <div className="w-20 h-20 sm:w-48 sm:h-48 bg-[#121212] flex items-center justify-center mr-6 shadow-xl">
            <span className="text-white text-2xl sm:text-8xl opacity-70">&#9835;</span>
          </div>

          <div className="flex flex-col justify-end text-white">
            <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-300 mb-1">
              Public Playlist
            </p>
            <h1 className="text-md sm:text-7xl font-bold leading-tight mb-2 truncate max-w-xs">
              {playlistName || 'MyPlaylist#1'}
            </h1>
          </div>
        </div>

        

        
      </div>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-details-title"
          className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-[#1a1a1a] text-white rounded-md w-[550px] max-w-full h-[400px] p-6 relative flex flex-col">
            <h2 id="edit-details-title" className="text-2xl font-bold mb-4">Edit details</h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 flex flex-col flex-1 overflow-auto"
            >
              <input
                type="file"
                accept="image/*"
                aria-invalid={errors.image ? "true" : "false"}
                className={`text-sm text-[#ccc] bg-[#1e1e1e] rounded-md border p-2 max-w-full mb-3 ${
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
              {errors.image && <p role="alert" className="text-red-500">{errors.image.message}</p>}

              <input
                type="text"
                aria-invalid={errors.playlistName ? "true" : "false"}
                {...register("playlistName", { required: "Playlist name is required" })}
                placeholder="Enter playlist name"
                className={`w-full border p-2 rounded-md bg-[#1e1e1e] text-white ${
                  errors.playlistName ? "border-red-500" : "border-[#696969]"
                }`}
              />
              {errors.playlistName && <p role="alert" className="text-red-500">{errors.playlistName.message}</p>}

              <textarea
                {...register("description")}
                placeholder="Enter description (optional)"
                className="w-full border p-2 h-24 rounded-md bg-[#1e1e1e] text-white border-[#696969]"
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

            <button
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-white text-3xl leading-none focus:outline-none"
            >
              &times;
            </button>

            <div className='hidden sm:block absolute bottom-5 left-6 right-6 text-xs font-bold text-gray-400'>
              By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;
