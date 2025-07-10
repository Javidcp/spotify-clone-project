import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAllAsRead } from "../redux/notificationSlice"
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

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



                <div className=" py-16 sm:w-3xl">
                    {notification.length === 0 ? (
                        <h2 className={`text-3xl text-center font-bold mb-6 text-gray-100`}>
                            Nothing new in music
                        </h2>
                    ) : (
                        <ul>
                            {notification.map((music, index) => (
                                <Link to={`/song/${music.songId}`} key={index} className={`flex flex-col gap-4  px-2 sm:px-5 py-1.5 sm:py-3 border-l-2  border-l-green-500 border max-w-70 sm:max-w-xl rounded-xl border-transparent bg-[#1a1a1a] hover:bg-[#1d1d1d]  mb-2 ${!music.isRead ? 'font-bold text-white' : 'text-gray-400'}`}>
                                    <div className="flex gap-3 sm:gap-5 items-center">
                                        <img src={music.coverImage} className="object-cover w-8 h-8 sm:w-15 sm:h-15 rounded-md sm:rounded-xl" alt="" />
                                        <div className="flex flex-col gap-1 sm:gap-2">
                                            <p className="text-xs sm:text-md">{music.title}</p>
                                            <p className="text-xs sm:text-xs">{music.message}</p>
                                        </div>
                                    </div>
                                        <span className="text-[6px] sm:text-xs">{formatDistanceToNow(new Date(music.createdAt), { addSuffix: true })}</span>
                                </Link>
                                ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
