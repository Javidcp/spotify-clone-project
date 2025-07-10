import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import api from "../utils/axios";
import { Plus, Check } from "lucide-react";
import { updateLikedSongs } from "../redux/playerSlice";

const LikeButton = ({ song }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  console.log(song._id);
  

  const likedSongs = useSelector((state) => state.player.likedSongs || []);
  
  const isLiked = likedSongs.some((s) => {
    const likedId = typeof s === 'object' ? s?._id : s;
    return likedId === song?._id;
  });

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      const { data } = await api.post("/likedSongs", { songId: song?._id });
      dispatch(updateLikedSongs(data.likedSongs));
    } catch (error) {
      console.error("Error toggling liked song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`
        flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 
        ${isLiked 
          ? "bg-green-500 text-white hover:bg-green-600" 
          : "border border-gray-400 text-gray-400 hover:border-white hover:text-white"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
    >
      {isLoading ? (
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : isLiked ? (
        <Check size={12} />
      ) : (
        <Plus size={12} />
      )}
    </button>
  );
};

export default LikeButton;