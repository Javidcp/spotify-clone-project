import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { Plus } from "lucide-react";
import { updateLikedSongs } from "../redux/playerSlice";

const LikeButton = ({ song }) => {
  const dispatch = useDispatch();

  const likedSongs = useSelector((state) => state.player.likedSongs);
  const isLiked = likedSongs?.some((s) => s._id === song._id || s === song._id);

  const handleToggleLike = async () => {
    try {
      const { data } = await api.post("/likedSongs", { songId: song._id });
      dispatch(updateLikedSongs(data.likedSongs));
    } catch (error) {
      console.error("Error toggling liked song:", error);
    }
  };

  return (
    <button onClick={handleToggleLike}>
      <Plus size={18} className={`p-1 ${isLiked ?  "rounded-full bg-green-500" : "border rounded-full text-gray-400"}`} />
    </button>
  );
};

export default LikeButton;
