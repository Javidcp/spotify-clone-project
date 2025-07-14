/* eslint-disable no-unused-vars */
import Logo from "../../assets/spotify_icon-white.png"
import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import api from "../../utils/axios"
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import OTPInput from 'react-otp-input';
import { useDispatch } from "react-redux";
import { setUser, setAuth } from "../../redux/authSlice";
import { toast } from 'react-toastify';

const Login = () => {
    const [view, setView] = useState(() => {
        return Number(localStorage.getItem("view")) || 1;
    });
    const [ loading, setLoading ] = useState(false)
    const navigate = useNavigate()
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, formState: { errors },reset } = useForm({ mode: 'onChange'});
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [timer, setTimer] = useState(0);

useEffect(() => {
    let interval;

    if (timer > 0) {
        interval = setInterval(() => {
            setTimer(prev => {
                if (prev === 1) {
                    setDisabled(false);
                    clearInterval(interval);
                }
                return prev - 1;
            });
        }, 1000);
    }

    return () => clearInterval(interval);
}, [timer]);


    const handleClick = () => {
        setDisabled(true);
        setTimer(30);
        toast.info('OTP resent');
        handleOtp({ email });
    };


    const email = watch('email', '');
    const password = watch('password', '');
    const masked = maskEmail(email);

    const handleOtp = async (data) => {
        if (!data.email) return toast.error("Please enter email");

        try {
            setLoading(true)
            await api.post('/otp/send-otp', { email: data.email });
            setView(2);
            setDisabled(true);
            setTimer(30);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to send OTP";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }
    
    

    const verifyOtp = async () => {
        if (otp.length !== 6) return toast.error("Enter full OTP");

        try {
            const res = await api.post('/otp/verify-otp', { email, otp });
            toast.success(res.data.message);

            localStorage.setItem("accessToken", res.data.token);
            dispatch(setUser(res.data.user));
            dispatch(setAuth(true));

            localStorage.removeItem("view");
            reset();
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP verification failed",err);
        }
    };

    const handleResetPassword = async (data) => {
        try {
            const response = await api.post('/auth/forgot-password', {
                email: data.email || email,
                newPassword: data.newPassword,
            });

            toast.success(response.data.message);
            setShowResetPassword(false);
            console.log("Reset Payload:", {
                email,
                newPassword
            });
            reset()
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating password");
        }
    };



    const handleLogin = async (data) => {
        try {
            const res = await api.post("/auth/login", {
                email: data.email,
                password: data.password,
            });

            localStorage.setItem("accessToken", res.data.token);
            dispatch(setUser(res.data.user));
            dispatch(setAuth(true));
            
            if (res.data.user?.role === "admin") {
                navigate('/admin/dashboard')
            } else {
                navigate("/");
            }

            localStorage.removeItem("view");
            reset();
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    const onSubmit = (data) => {
        if (showResetPassword) {
            handleResetPassword(data);
        } else {
            handleLogin(data);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const res = await api.post("/auth/google-auth", {
            credential: credentialResponse.credential,
        });

        localStorage.setItem("accessToken", res.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        dispatch(setUser(res.data.user));
        dispatch(setAuth(true));
        reset();
        navigate("/");
    } catch (error) {
        console.error(error.response?.data?.message || "Google login failed");
        toast.error(error.response?.data?.message || "Google login failed");
    }
};


    return (
        <>
            {view === 1 && (
                <div style={{background: "min-h-screen  sm:linear-gradient(0deg, black, #1F1F1F 80%)"}} className='pt-5 text-white flex flex-col items-center justify-center'>
                    <div className='md:w-[700px] p-4 rounded-xl text-center flex flex-col items-center' style={{background: "linear-gradient(0deg, #1F1F1F, black 30%)"}}>
                        <div className="flex justify-center">
                            <img src={Logo} alt="Logo" className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl sm:text-4xl my-8" style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>Log in to Spotify</h2>
                        
                        <div className="hidden sm:flex">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Google login failed');
                                }}
                                type="standard"
                                size="large"
                                width="370"
                                text="continue_with"
                                shape="pill"
                            />
                        </div>
                        <div className="sm:hidden flex items-center justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Google login failed');
                                }}
                                type="standard"
                                size="large"
                                width="230"
                                text="continue_with"
                                shape="pill"
                            />
                        </div>

                        <hr className="w-[80%] my-8 text-zinc-800" />

                        <form onSubmit={handleSubmit(handleOtp)} className="my-5 text-left max-w-[320px]">
                            <label htmlFor="email" className="text-xs" style={{ fontFamily: 'CircularStd', fontWeight: 900 }}>
                                Email address
                            </label><br />
                            <input 
                                id="email"
                                type="email" 
                                placeholder="name@domain.com" 
                                className={`border-[0.1rem] rounded-[4px] p-3 w-full sm:w-[320px] mt-1 ${
                                    errors.email ? 'border-red-500' : 'border-[#818181]'
                                }`}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                            
                            <button type="submit" disabled={loading} className="w-[100%] text-center p-3 bg-[#1ed760] text-black rounded-full mt-5" style={{ fontFamily: 'CircularStd', fontWeight: 800 }}>
                                { loading ? "sending otp..." : 'Continue' }
                            </button>
                        </form>

                        <div className="mt-2 text-xs sm:text-md text-[#818181] text-center" style={{ fontFamily: 'CircularStd', fontWeight: 400 }}>
                            Don't have an account? <Link to='/signup' className="underline text-white">Sign up for Spotify</Link>
                        </div>
                    </div>
                    
                    <div className="text-[#818181] bg-[#1F1F1F] mt-8 w-full text-center p-5 text-[8px] sm:text-xs">
                        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                    </div>
                </div>
            )}

            {view === 2 && (
                <div className='bg-[#121212] min-h-screen flex justify-between py-4 px-8'>
                    <img src={Logo} className='w-6 h-6' alt="" />
                    <div className="flex flex-col items-center w-fit py-16">
                        <p className="text-white text-sm sm:text-2xl mb-8" style={{ fontFamily: 'CircularStd', fontWeight: 900 }}>
                            Enter the 6-digit code sent to <br />
                            you at {masked}.
                        </p>
                        
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    style={{width: "100%"}}
                                    className="h-[34px] sm:h-[54px] sm:max-w-[46px] text-center text-white bg-[#121212] border border-[#818181] rounded-md mx-[6px] text-2xl focus:outline-none focus:ring-1 focus:border-white caret-transparent"
                                />
                            )}
                        />
                        
                        <button
                            className={`mt-4 w-20 sm:w-30 bg-transparent border px-3 py-1 rounded-full text-[8px] sm:text-sm ${ disabled ? 'border-[#191919] text-[#818181]' : 'border-[#818181] text-white hover:bg-[#81818133]'}`}
                            style={{ fontFamily: 'CircularStd', fontWeight: 900 }}
                            onClick={handleClick}
                            disabled={disabled}
                        >
                            {disabled ? `Resend in ${timer}s` : 'Resend code'}
                        </button>

                        <button 
                            onClick={verifyOtp} 
                            className='w-full p-3 bg-green-500 rounded-full my-10' 
                            style={{ fontFamily: 'CircularStd', fontWeight: 900 }}
                        >
                            Login
                        </button>

                        <button 
                            onClick={() => setView(3)} 
                            className='text-white mt-2 underline text-sm sm:text-md' 
                            style={{ fontFamily: 'CircularStd', fontWeight: 900 }}
                        >
                            Log in with a password
                        </button>
                    </div>
                    <div></div>
                </div>
            )}

            {view === 3 && (
                <div style={{background: "min-h-screen linear-gradient(0deg, black, #1F1F1F 80%)"}} className='pt-5 text-white flex flex-col items-center justify-center'>
                    <div className='md:w-[700px] p-4 rounded-xl text-center flex flex-col items-center' style={{background: "linear-gradient(0deg, #1F1F1F, black 30%)"}}>
                        <div className="flex justify-center">
                            <img src={Logo} alt="Logo" className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl sm:text-4xl my-8" style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>Log in to Spotify</h2>
                        
                        <div className="hidden sm:flex">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Google login failed');
                                }}
                                type="standard"
                                size="large"
                                width="370"
                                text="continue_with"
                                shape="pill"
                            />
                        </div>
                        <div className="sm:hidden flex items-center justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Google login failed');
                                }}
                                type="standard"
                                size="large"
                                width="230"
                                text="continue_with"
                                shape="pill"
                            />
                        </div>

                        <hr className="w-[80%] my-8 text-zinc-800" />

                        <form onSubmit={handleSubmit(onSubmit)}  className="my-5 w-[250px] sm:w-[320px] text-left">
                            <label htmlFor="email-login" className="text-xs font-bold">Email address</label>
                            <input
                                id="email-login"
                                type="email"
                                placeholder="name@domain.com"
                                className={`border-[0.1rem] rounded-[4px] p-3 w-full mt-1 ${errors.email ? 'border-red-500' : 'border-[#818181]'}`}
                                {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

                            {!showResetPassword ? (
                                <>
                                    <label htmlFor="password" className="text-xs mt-4 block font-bold">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="password"
                                        className={`border-[0.1rem] rounded-[4px] p-3 w-full mt-1 ${errors.password ? 'border-red-500' : 'border-[#818181]'}`}
                                        {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Password must be at least 10 characters'
                                        }
                                        })}
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

                                    <button type="button" onClick={() => setShowResetPassword(true)} className="text-xs text-blue-500 mt-2">Forgot password?</button>
                                </>
                            ) : (
                                <>
                                    <label htmlFor="new-password" className="text-xs mt-4 block font-bold">New Password</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        placeholder="Enter new password"
                                        className={`border-[0.1rem] rounded-[4px] p-3 w-full mt-1 ${errors.newPassword ? 'border-red-500' : 'border-[#818181]'}`}
                                        {...register('newPassword', {
                                        required: 'New password is required',
                                        minLength: {
                                            value: 10,
                                            message: 'Password must be at least 10 characters'
                                        }
                                        })}
                                    />
                                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}

                                    <button type="button" onClick={() => setShowResetPassword(false)} className="text-xs text-gray-500 mt-2 underline">Cancel</button>
                                </>
                            )}

                            <button type="submit" className="w-full text-center p-3 bg-[#1ed760] text-black rounded-full mt-5 font-bold">
                                {showResetPassword ? "Update Password" : "Sign in"}
                            </button>
                        </form>

                        
                        <div>
                            <button 
                                className="underline mb-5 text-xs sm:text-md" 
                                onClick={() => setView(1)}
                            >
                                Login without password
                            </button>
                        </div>

                        <div className="text-[#818181] text-center text-xs sm:text-md" style={{ fontFamily: 'CircularStd', fontWeight: 400 }}>
                            Don't have an account? <Link to='/signup' className="underline text-white">Sign up for Spotify</Link>
                        </div>
                    </div>
                    
                    <div className="text-[8px] text-[#818181] bg-[#1F1F1F] mt-8 w-full text-center p-5 sm:text-xs">
                        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                    </div>
                </div>
            )}
        </>
    )
}

export default Login

function maskEmail(email) {
    if (!email || !email.includes('@')) return '';

    const [user, domain] = email.split('@');
    const maskedUser = user.length > 2
        ? user[0] + '*'.repeat(user.length - 2) + user[user.length - 1]
        : user[0] + '*';

    const [domainName, domainExt] = domain.split('.');
    const maskedDomain = domainName.length > 2
        ? domainName[0] + '*'.repeat(domainName.length - 2) + domainName[domainName.length - 1]
        : domainName[0] + '*';

    return `${maskedUser}@${maskedDomain}.${domainExt}`;
}