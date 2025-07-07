import React from 'react';
import { useSelector } from 'react-redux';
import UserAvatar from '../UserAvatar';

const Profile = () => {
    const user = useSelector(state => state.auth.user);
    const baseUrl = 'http://localhost:5050';

    if (!user) return <p>Loading...</p>;

const photoUrl = user.profileImage && user.profileImage.startsWith('http')
    ? user.profileImage
    : user.profileImage
        ? `${baseUrl}/${user.profileImage}`
        : null;

    // console.log("User from Redux:", user);
    // console.log("Computed photoUrl:", photoUrl);


    return (
        <div className="p-3">
            <UserAvatar name={user.username} photo={photoUrl} size={30} />
        </div>
    );
};

export default Profile;
