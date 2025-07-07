import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAllAsRead } from "../redux/notificationSlice"
import { Link } from "react-router-dom";

export default function Notification() {

    const dispatch = useDispatch();
    const notification = useSelector((state) => state.notifications.items);
    const userId = useSelector((state) => state.auth.user?._id);

    useEffect(() => {
        console.log(userId, 'before dispatch');
        dispatch(fetchNotifications(userId));
        dispatch(markAllAsRead(userId));
    }, [dispatch, userId])


    return (
        <div className="pt-10 bg-[#121212] rounded-t-lg flex items-center text-white">
            <div className="mx-auto">
                <div className="mb-5">
                    <h1 className="text-3xl font-bold mb-4">What's New</h1>
                    <p className="text-gray-400 text-md">
                        The latest releases from song.
                    </p>
                </div>



                <div className=" py-16 w-3xl">
                    {notification.length === 0 ? (
                        <h2 className={`text-3xl text-center font-bold mb-6 text-gray-100`}>
                            Nothing new in music
                        </h2>
                    ) : (
                        <ul>
                            {notification.map((music, index) => (
                                <Link to={`/song/${music.songId}`} key={index} className={`flex items-center gap-2 ${!music.isRead ? 'font-bold text-white' : 'text-gray-400'}`}>
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    {music.message}
                                </Link>
                                ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
