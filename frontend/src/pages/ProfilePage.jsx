import React from 'react';
import Profile from '../components/usercomponents/Profile';

const ProfilePage = () => {
    return (
        <div className="max-w-2xl mx-auto">
             <h1 className="text-4xl font-bold mb-8 text-center">My Profile</h1>
            <Profile />
        </div>
    );
};

export default ProfilePage;