import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PremiumProtect = ({ children }) => {
    const { user } = useAuth();
    const isPremiumUser = user?.isPremium
    return isPremiumUser ?  <Navigate to="/" replace /> : children;
};

export default PremiumProtect;