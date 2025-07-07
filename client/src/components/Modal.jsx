import React, { useEffect, useState } from 'react'
import { usePlayer } from "../hooks/redux"
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Modal = () => {
    const { user } = useAuth()
    const { currentTrack, pausePlayback } = usePlayer() 
    const [songCount, setSongCount] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()

    const isPremiumUser = user?.isPremium

    useEffect(() => {
        if (!isPremiumUser && currentTrack?.id) {
        setSongCount(prev => prev + 1)
        }
    }, [currentTrack?.id, isPremiumUser])

    useEffect(() => {
        if (songCount >= 3) {
        setShowModal(true)
            setTimeout(() => {
        pausePlayback();
        }, 100);
        }
    }, [songCount, pausePlayback])

    if (isPremiumUser) return null

    const handleClose = () => {
        setShowModal(false)
        setSongCount(0)
    }

    return (
        <>
        {showModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <h2 className="text-2xl font-bold text-center underline mb-4 text-[#1ED760]">Upgrade to Premium</h2>
                <p className="text-gray-600 mb-6">
                You've played 3 songs. Get unlimited access with Premium!
                </p>
                <div className='flex justify-between'>
                    <button
                onClick={() => navigate('/premium')}
                className="bg-[#1e1e1e] text-white px-4 py-2 rounded"
                >
                Goto premium
                </button>
                <button
                onClick={handleClose}
                className="underline text-black px-4 py-2 rounded"
                >
                Close
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    )
}

export default Modal