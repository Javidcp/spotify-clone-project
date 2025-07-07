import React from 'react'
import BottomPlayer from '../components/Player';
import useAuth from '../hooks/useAuth';

const MainHome = () => {
  const { isAuthenticated } = useAuth()

    return (
        <div className='bg-[#1a1a1a] text-white  h-[100%] overflow-hidden'>
            <MyComponent/>
            {/* {isAuthenticated && <Modal/>} */}
            {isAuthenticated &&<BottomPlayer/>}
        </div>
    )
}

// import { useSelector } from "react-redux";
import Footer from './Footer';
import SongCarousel from '../components/SongCarousal/IndiaBest';
import SpotifyArtistCarousel from '../components/Artist/ArtistCarousel';
import RecentlyPlayedSection from '../components/RecentlyPlayedSection';
import Modal from '../components/Modal';

const MyComponent = () => {
  // const { user, isAuthenticated } = useSelector((state) => state.auth);

  // console.log("Redux user:", user);
  // console.log("Authenticated:", isAuthenticated);

  return (
    <div>
      <RecentlyPlayedSection/>
      <SongCarousel/>
      <SpotifyArtistCarousel/>
    </div>
  );
};


export default MainHome