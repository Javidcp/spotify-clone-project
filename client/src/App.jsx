import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sigup from './components/Login/Sigup'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from './pages/RootLayout'
import Home from './pages/Home'
import Login from './components/Login/Login'
import Account from './pages/Account'

import { setAuth, setUser, setLoading } from './redux/authSlice'
import { useEffect } from 'react'
import api from "./utils/axios"
import { useDispatch, useSelector } from 'react-redux'
import Premium from './pages/Premium'
import Download from './pages/Download'
import Notification from './pages/Notification'
import IndiaBestAll from './components/SongCarousal/IndiaBestAll';
import Inside from './components/SongCarousal/Inside';
import Dashboard from './admin/Dashboard';
import AdminPanel from './admin/AdminPanel';
import AdminRoute from './components/Auth/AdminRoute';
import Unauthorized from './pages/Unauthorized';
import BottomPlayer from './components/Player';
import SpotifyArtist from './components/Artist/ArtistAll';
import ArtistPage from './components/Artist/ArtistInside';
import User from './admin/User';
import Songs from './admin/Songs';
import Artist from './admin/Artist';
import AddSong from './admin/AddSong';
import AdminCreateArtist from './admin/AddArtist';
import FullSong from './components/FullSong';
import GlobalAudioManager from './components/GlobalAudioPlayer';
import LikedSong from './components/LikedSong';
import BrowseInterface from './components/Navbar/Browser';
import CreatePlaylist from './components/CreatePlaylist';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import AuthProtected from './components/Auth/AuthProtected';
import EditArtist from './admin/EditArtist';
import GenrePlaylistForm from './admin/GenrePlaylistForm';
import GenreInside from './admin/GenreInside';
import EditSong from './admin/EditSong';

import { setCurrentUser as setCurrentUser } from './redux/recentlyPlayedPlaylistsSlice';
import { clearUserSession as clearUserSession } from './redux/recentlyPlayedPlaylistsSlice';
import { socket } from './socket';
import { addNotification } from './redux/notificationSlice';
import SingleSong from './components/SingleSong';
import Coupan from './admin/Coupan';
import Success from './pages/Success';
import Failed from './pages/Failed';
import PlaylistInside from './components/PlaylistInside';

const router = createBrowserRouter([
  { path: '', element: <><RootLayout/> <GlobalAudioManager/> </>, errorElement: <ErrorPage/> , children: [
    { path: '/', element: <Home/> },
    { path: '/search', element: <BrowseInterface/> },
    { path: '/account', element: <Account  /> },
    { path: '/premium', element: <Premium  /> },
    { path: '/download', element: <Download /> },
    { path: '/notification', element: <Notification /> },
    { path: '/song/:songId', element: <SingleSong/> },
    { path: '/indiabest', element: <IndiaBestAll /> },
    { path: '/playlist/:playlistId', element: <ProtectedRoute><Inside /></ProtectedRoute> },
    { path: '/artist', element: <SpotifyArtist /> },
    { path: '/artist/:artistId', element: <ProtectedRoute><ArtistPage /></ProtectedRoute> },
    {path: '/full', element: <ProtectedRoute><FullSong/></ProtectedRoute>},
    { path: '/liked', element: <ProtectedRoute><LikedSong/></ProtectedRoute> },
    { path: '/createplaylist', element: <ProtectedRoute><CreatePlaylist/></ProtectedRoute> },
    { path: '/createdplaylist/:playlistId', element: <PlaylistInside/> }
  ]},
  { path: '/signup', element: <AuthProtected><Sigup /></AuthProtected> },
  { path: '/login', element: <AuthProtected><Login /></AuthProtected> },
  { path: '/player', element: <ProtectedRoute><BottomPlayer/></ProtectedRoute> },
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '/payment-success', element: <Success/> },
  { path: '/payment-cancel', element: <Failed/> },

  { path: '/admin', element: <AdminRoute><AdminPanel /></AdminRoute>, children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'users', element: <User/> },
    { path: 'songs', element: <Songs/> },
    { path: 'addSong', element: <AddSong/> },
    { path: 'editSong/:songId', element: <EditSong /> },
    { path: 'artist', element: <Artist/> },
    { path: 'addArtist', element: <AdminCreateArtist/> },
    { path: 'editArtist/:artistId', element: <EditArtist /> },
    { path: 'genre', element: <GenrePlaylistForm/> },
    { path: 'genre/:id', element: <GenreInside/> },
    { path: 'coupon', element: <Coupan/> }
  ] }
])

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const userId = useSelector((state) => state.auth.user?._id);


  useEffect(() => {
    if (user && user._id) {
      dispatch(setCurrentUser(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch(setUser(userData));
        dispatch(setAuth(true));
        
        if (userData._id) {
          dispatch(setCurrentUser(userData._id));
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) return;

        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        dispatch(setUser(res.data));
        dispatch(setAuth(true));
        localStorage.setItem('user', JSON.stringify(res.data));
        
        if (res.data._id) {
          dispatch(setCurrentUser(res.data._id));
          dispatch(setCurrentUser(res.data._id));
        }
        
      } catch (error) {
        console.error("Auth failed:", error.response?.data?.message);
        dispatch(setAuth(false));
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        
        dispatch(clearUserSession());
        
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);




useEffect(() => {
  if (!userId) return;

  const handleNotification = (message) => {
    
    dispatch(
      addNotification({
        userId,
        message,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    );
  };

  socket.on('new-notification', handleNotification);

  return () => socket.off('new-notification', handleNotification);
}, [dispatch, userId]);


  const { isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <div className="text-white h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className='bg-black'>
        <RouterProvider router={router} />
        <ToastContainer />
    </div>
  )
}

export default App