import React, { useState, useEffect } from 'react';
import { X, User, Camera, Pen   } from 'lucide-react';
import api from "../utils/axios";
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { useNavigate } from "react-router-dom";
import RecentlyPlayedSection from '../components/RecentlyPlayedSection';
import { toast } from 'react-toastify';
import { PiCoinVerticalFill } from "react-icons/pi";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';




const Account = () => {
    const user = useSelector((state) => state.auth.user);
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [initialName, setInitialName] = useState('');
    const [initialImage, setInitialImage] = useState(null);
    const token = localStorage.getItem('accessToken');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ coupon, setCoupon ] = useState(null)
    const [ codeOpen, setCodeOpen ] = useState(false)

    useEffect(() => {
        if (user) {
            const baseUrl = 'http://localhost:5050/';
            const userImgUrl = user.profileImage?.startsWith('http')
                ? user.profileImage
                : `${baseUrl}${user.profileImage}`;

            setName(user.username || '');
            setInitialName(user.username || '');

            setPreviewUrl(user.profileImage ? userImgUrl : null);
            setInitialImage(user.profileImage ? userImgUrl : null);
        }
    }, [user]);

    const openModal = () => setIsOpen(true);

    const closeModal = () => {
        setIsOpen(false);
        setSelectedImage(null);
        setName(initialName);
        setPreviewUrl(initialImage);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const hasChanges = () => {
        const nameChanged = name !== initialName;
        const imageChanged = selectedImage !== null;
        return nameChanged || imageChanged;
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("username", name);
        if (selectedImage) {
            formData.append("profileImage", selectedImage);
        }

        try {
            const res = await api.put('/auth/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const updatedUser = res.data.user;

            if (updatedUser.profileImage) {
                const baseUrl = 'http://localhost:5050/';
                updatedUser.profileImage = updatedUser.profileImage.startsWith('http')
                    ? updatedUser.profileImage
                    : `${baseUrl}${updatedUser.profileImage}`;
                updatedUser.profileImage += `?t=${new Date().getTime()}`;
            }

            setName(updatedUser.username);
            setPreviewUrl(updatedUser.profileImage || null);
            setSelectedImage(null);
            setInitialName(updatedUser.username);
            setInitialImage(updatedUser.profileImage || null);
            closeModal();

            dispatch(setUser(updatedUser));
            toast.success("Successfully updated");
            localStorage.setItem('user', JSON.stringify(updatedUser));
            navigate('/account');

        } catch (error) {
            console.error("Failed to update profile:", error?.response?.data?.message || error.message);
            toast.error("Error: " + error.message);
        }
    };



    const handleShare = async () => {
        if (navigator.share) {
        try {
            await navigator.share({
                url: `signup?ref=${user.referralCode}`,
            });
        } catch (err) {
            console.log('Share failed:', err);
        }
        } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        }
    };


    const rewardpoint = user.rewardPoints

    const handleWithdraw = async () => {
        try {
            const res = await api.post('/referral/withdraw')
            setCoupon(res.data.coupon)
            setCodeOpen(true)

            const updatedUser = {
                ...user,
                rewardPoints: user.rewardPoints - 500,
            };
            dispatch(setUser(updatedUser));
        } catch (err) {
            toast.err(err.response?.data?.message || "Something went wrong")
        }
    }

    

    const handleCopy = () => {
        navigator.clipboard.writeText(coupon.code)
        .then(() => {
            toast.success("Text copied to clipboard!");
        })
        .catch((err) => {
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <div className="relative bg-[#121212]">
            <div className={`transition-all duration-300 ${isOpen ? 'blur-sm scale-95' : ''}`}>
                <div className='w-full flex items-center  rounded-md overflow-hidden p-5 text-white gap-5'>
                    <div>
                        <div className="w-60 h-60 bg-black rounded-full flex items-center justify-center overflow-hidden text-white text-5xl font-bold">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className='text-9xl'>{name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <span>Profile</span>
                        <h2 className='text-7xl font-bold mt-2'>{name}</h2>
                    </div>
                </div>
                <div className='p-8 bg-[#191919] text-white'>
                    <button
                        onClick={openModal}
                        className='flex items-center gap-2 p-2 border border-zinc-400 rounded-md px-4 hover:bg-zinc-800 transition-colors'
                    >
                        Edit <Pen size={15} />
                    </button>
                </div>
                <div className='flex justify-between items-center'>
                    <div>
                        <div className='flex gap-5 items-center'>
                            <div className='flex items-center justify-around mt-3 ml-3 text-white p pl-5 overflow-hidden gap-5 rounded-md border-[#1e1e1e] border-[1.5px] '>
                                <p className='text-lg font-semibold'>Wallet: </p>
                                <div className='flex items-center gap-4'>
                                    <span className='text-xl font-bold'>{user.rewardPoints || '0'}</span>
                                    <PiCoinVerticalFill size={20} className='text-yellow-300' />
                                </div>
                            <button
                                onClick={handleWithdraw}
                                disabled={rewardpoint < 500}
                                className={`p-2  text-black h-18 ${rewardpoint < 500 ? 'bg-[#595959] cursor-not-allowed' : 'cursor-pointer bg-white'} `}
                            >
                                Withdraw
                            </button>
                            </div>
                            <span  data-tooltip-id="my-tooltip" data-tooltip-content="500 reward point can covert to coupon code">
                                <BsFillQuestionCircleFill size={20} className="text-white mt-5" />
                            </span>
                            <Tooltip id="my-tooltip" />
                        </div>
                        {codeOpen && (
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center flex-col justify-center z-50">
                                <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                                        <div>
                                        
                                        <span>copy the code:</span>
                                        <div className='border-2 bg-[#1e1e1e] text-white mt-1 rounded-lg flex gap-8 border-[#393939] overflow-hidden'>
                                            <p className='font-semibold p-3'>{coupon.code}</p>
                                            <button onClick={handleCopy} className='bg-white text-black px-3 '>Copy</button>
                                        </div>
                                        </div>
                                </div>
                                <button onClick={() => setCodeOpen(false)} className='bg-red-500 p-3 mt-4 rounded-full'>
                                    <X/>
                                </button>
                            </div>
                        )}
                    </div>
                    <button onClick={handleShare} className='text-white border rounded hover:bg-white hover:text-black h-13 px-5  mt-3 mr-3'>
                        Referral a friend 
                    </button>
                </div>
                <RecentlyPlayedSection />
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141414] rounded-lg w-full max-w-md p-6 relative shadow-2xl">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-white text-2xl font-bold mb-8">Profile details</h2>

                        <div className="flex items-center mb-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={40} className="text-gray-400" />
                                    )}
                                </div>

                                <label className="absolute bottom-0 right-0 bg-[#1d1d1d] rounded-full p-1 cursor-pointer hover:bg-[#1e1e1e] transition-colors">
                                    <Camera size={16} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex-1 ml-4">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#1d1d1d] text-white px-4 py-3 rounded-lg border-none outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mb-6">
                            <button
                                onClick={handleSave}
                                className={`px-8 py-3 rounded-full font-medium transition-colors ${
                                    hasChanges()
                                        ? 'bg-white text-black hover:bg-gray-100 cursor-pointer'
                                        : 'bg-[#1d1d1d] text-gray-300 cursor-not-allowed'
                                }`}
                                disabled={!hasChanges()}
                            >
                                Save
                            </button>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            By proceeding, you agree to give Spotify access to the image you choose to upload.
                            Please make sure you have the right to upload the image.
                        </p>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Account;
