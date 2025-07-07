import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAllRecentlyPlayed } from '../redux/recentlyPlayedPlaylistsSlice';

const RecentlyPlayedSection = () => {
  const navigate = useNavigate();
  
  const recentItems = useSelector(selectAllRecentlyPlayed);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (!isAuthenticated) return null;

  const displayItems = recentItems.slice(0, 8);

  const handleItemClick = (item) => {
    if (item.type === 'playlist') {
      navigate(`/playlist/${item.id}`);
    } else if (item.type === 'artist') {
      navigate(`/artist/${item.id}`);
    }
  };

  return (
    <div className=" bg-[#121212]">
      {displayItems.length > 0 ? (
        <div className='p-8'>
          <h2 className="text-2xl font-bold text-white mb-4">Recently Played</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {displayItems.map(item => (
              <div 
                key={`${item.type}_${item.id}`} 
                className="cursor-pointer hover:bg-[#191919] px-5 py-3 items-center flex gap-3 bg-[#1d1d1d] rounded-lg transition-colors"
                onClick={() => handleItemClick(item)}
              >
                <div className="">
                  <img 
                    src={
                      item.type === 'playlist'
                        ? (item.cover || item.coverImage)
                        : (item.photo || item.image || item.profileImage)
                    } 
                    alt={item.name}
                    className={`w-10 h-10 object-cover ${item.type === 'artist' ? 'rounded-full' : 'rounded-lg'}`}
                    onError={(e) => {
                      e.target.src = item.type === 'playlist' ? '/default-playlist.png' : '/default-artist.png';
                    }}
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-gray-400 text-xs capitalize">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">
        </div>
      )}
    </div>
  );
};

export default RecentlyPlayedSection;