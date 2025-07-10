import Logo from "../../assets/spotify_icon-white.png";
import { GoogleLogin } from '@react-oauth/google';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoIosArrowBack, IoIosCheckmark } from "react-icons/io";

import { useDispatch } from "react-redux"
import { setUser, setAuth } from "../../redux/authSlice";

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    
    const emailForm = useForm({
        defaultValues: {
            email: ''
        }
    });
    
    const passwordForm = useForm({
        defaultValues: {
            password: ''
        }
    });
    
    const profileForm = useForm({
        defaultValues: {
            name: '',
            dobYear: '',
            dobMonth: '',
            dobDay: '',
            gender: ''
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const [view, setView] = useState(() => {
        return Number(localStorage.getItem("view")) || 1;
    });

    useEffect(() => {
        localStorage.setItem("view", view);
    }, [view]);



    const goBack = () => {
        setView(view - 1);
    };

    const password = passwordForm.watch('password');
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumberOrSpecial = /[\d!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);
    const hasMinLength = password.length >= 10;

    const handleEmailSubmit = async (data) => {
        try {
            const res = await api.post("/auth/check-email", { email: data.email });
            console.log("Email check:", res.data);
            setView(view + 1);
        } catch (err) {
            emailForm.setError('email', {
                type: 'manual',
                message: err.response?.data?.message || "Something went wrong"
            });
        }
    };

    const handlePasswordSubmit = () => {
        if (hasLetter && hasNumberOrSpecial && hasMinLength) {
            setView(view + 1);
        } else {
            toast.info("Please meet all password requirements");
        }
    };
    

    const handleRegistration = async (data) => {
    try {
        const dob = `${data.dobYear}-${data.dobMonth.padStart(2, '0')}-${data.dobDay.padStart(2, '0')}`;
        console.log("Formatted DOB:", dob);
        
        const urlParams = new URLSearchParams(location.search);
        const referredBy = urlParams.get('ref') || null;
        
        const userData = {
            username: data.name,
            email: emailForm.getValues('email'),
            password: passwordForm.getValues('password'),
            dateOfBirth: dob,
            gender: data.gender || "Prefer not to say",
            referredBy,
        };

        
        const res = await api.post("/auth/register", userData, {
            withCredentials: true,
        });
        
        console.log("API response received:", res.data);
        console.log("User registered successfully");

        localStorage.setItem("accessToken", res.data.token);
        dispatch(setUser(res.data.user));
        dispatch(setAuth(true));
        localStorage.removeItem("view");
        navigate("/");
        
    } catch (error) {
        console.error("=== REGISTRATION ERROR ===");
        console.error("Error object:", error);
        console.error("Error response:", error.response);
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        console.error("Error response headers:", error.response?.headers);
        
        if (error.response?.data?.message) {
            console.error("Backend error message:", error.response.data.message);
            toast.error(error.response.data.message);
        } else if (error.response?.data?.error) {
            console.error("Backend error:", error.response.data.error);
            toast.error(error.response.data.error);
        } else {
            console.error("Generic error:", error.message);
            toast.error("Registration failed: " + error.message);
        }
    }
    
    console.log("=== REGISTRATION DEBUG END ===");
};

    const CustomCheckbox = ({ checked, label }) => (
        <div className="flex items-center mb-2 mt-3">
            <div className="relative w-5 h-5 mr-2">
                <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="opacity-0 absolute w-3 h-3 sm:w-5 sm:h-5 z-10 cursor-default"
                />
                <span className={`block w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${checked ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                    {checked && (
                        <IoIosCheckmark size={20} className="text-black font-light absolute top-[-3.5px] sm:top-[-1.5px] right-[4px] sm:right-[2px]" />
                    )}
                </span>
            </div>
            <label className="text-xs sm:text-sm select-none">{label}</label>
        </div>
    );

    return (
        <>
            {view === 1 && (
                <div className="bg-[#121212] min-h-screen flex justify-center px-4 sm:px-0 text-white">
                    <div className='my-8 '>
                        <div className="flex justify-center">
                            <img src={Logo} alt="Logo" className="w-10 h-10 " />
                        </div>
                        <h2 className="text-center text-2xl sm:text-5xl/14 mt-7 " style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>
                            Sign up to <br />start listening
                        </h2>
                        
                        {(new URLSearchParams(location.search).get('ref') || '') && (
                            <div className="flex flex-col items-center my-5">
                                <p>You're signing up with referral code</p>
                                <div className="px-5 border-[#1e1e1e] py-3 mt-2 rounded tracking-[5px] border-2 text-[#1ed760] font-bold">{new URLSearchParams(location.search).get('ref') || ''}</div>
                            </div>
                        )}

                        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="mt-5">
                            <label className="text-xs" style={{ fontFamily: 'CircularStd', fontWeight: 900 }}>Email address</label><br />
                            <input 
                                type="email" 
                                placeholder="name@domain.com" 
                                {...emailForm.register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                className="border-[0.1rem] rounded-[4px] p-3 w-full sm:w-[100%] mt-1 border-[#818181]" 
                            />
                            {emailForm.formState.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
                            )}
                            
                            <button type="submit" className="w-[100%] text-center p-3 bg-[#1ed760] text-black rounded-full mt-5" style={{ fontFamily: 'CircularStd', fontWeight: 800 }}>
                                Next
                            </button>
                        </form>

                        <div className="relative flex items-center my-8">
                            <div className="flex-grow border-t border-[#818181]"></div>
                            <span className="mx-4 text-xs">or</span>
                            <div className="flex-grow border-t border-[#818181]"></div>
                        </div>

                        <div className="space-y-4 max-w-[370px] sm:min-w-[370px]">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const urlParams = new URLSearchParams(location.search);
                                        const referredBy = urlParams.get("ref") || null;

                                        const res = await api.post("/auth/google-auth", {
                                            credential: credentialResponse.credential,
                                            referredBy,
                                        });
                                        localStorage.setItem("accessToken", res.data.token);
                                        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
                                        dispatch(setUser(res.data.user));
                                        dispatch(setAuth(true));

                                        localStorage.removeItem("view");
                                        navigate("/");
                                    } catch (error) {
                                        console.error(error.response?.data?.message || "Google login failed");
                                    }
                                }}
                                onError={() => {
                                    console.log("Google Login Failed");
                                }}
                                type="standard"
                                size="large"
                                width="100%"
                                text="continue_with"
                                shape="pill"
                            />

                        </div>

                        <hr className="text-[#818181] my-8" />

                        <div className="text-[#818181] text-xs sm:text-md text-center" style={{ fontFamily: 'CircularStd', fontWeight: 400 }}>
                            Already have an account?<Link to='/login' className="underline text-white">Log in here</Link>
                        </div>

                        <div className="text-[8px] sm:text-[13px] text-[#818181] text-center my-5" style={{ fontFamily: 'CircularStd', fontWeight: 500 }}>
                            This site is protected by reCAPTCHA and the Google <br />
                            <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                        </div>
                    </div>
                </div>
            )}

            {view === 2 && (
                <div className='bg-[#121212] min-h-screen pt-8 flex flex-col justify-center items-center text-white' style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>
                    <div>
                        <div className="flex justify-center">
                            <img src={Logo} alt="Logo" className="w-10 h-10 " />
                        </div>
                        <div className=' flex justify-center'>
                            <div className='relative text-white my-8 flex justify-center'>
                                <div className='absolute border-1 w-70 sm:w-100 border-[#818181]'></div>
                                <div className='absolute border-1 w-35 sm:w-50 border-green-400 right-0'></div>
                            </div>
                        </div>
                        <div className='flex w-[250px] sm:w-[400px] items-center gap-1.5'>
                            <button type="button" onClick={goBack}>
                                <IoIosArrowBack  className='text-zinc-400 text-[20px] sm:text-[30px]' />
                            </button>
                            <div>
                                <div className="text-zinc-400 text-xs sm:text-md" style={{ fontFamily: 'CircularStd', fontWeight: 400 }}>Step 1 of 2</div>
                                <div className="text-sm sm:text-lg">Create a password</div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-center my-6 mx-auto'>
                            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                                <label className="text-xs sm:text-[14px]" style={{ fontFamily: 'CircularStd', fontWeight: 900 }}>Password</label><br />
                                <div className='relative flex w-[250px] sm:w-[300px] mb-2'>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        {...passwordForm.register('password', {
                                            required: 'Password is required',
                                            validate: {
                                                hasLetter: () => hasLetter || 'Password must contain at least 1 letter',
                                                hasNumberOrSpecial: () => hasNumberOrSpecial || 'Password must contain at least 1 number or special character',
                                                hasMinLength: () => hasMinLength || 'Password must be at least 10 characters long'
                                            }
                                        })}
                                        className="border-[0.1rem] rounded-[4px] p-3 w-[100%] mt-1 border-[#818181]" 
                                    />
                                    <div className="absolute right-2 top-[40%]" onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                    </div>
                                </div>
                                <label htmlFor="" className='text-xs sm:text-sm '>Your password must contain at least</label><br />

                                <CustomCheckbox checked={hasLetter} label="1 letter" />
                                <CustomCheckbox checked={hasNumberOrSpecial} label="1 number or special character (example: # ? ! &)" />
                                <CustomCheckbox checked={hasMinLength} label="10 characters" />

                                <button type="submit" className="w-[100%] text-center p-3 bg-[#1ed760] text-black rounded-full mt-5" style={{ fontFamily: 'CircularStd', fontWeight: 800 }}>
                                    Next
                                </button>
                            </form>
                            <div className="text-[8px] sm:text-[13px] text-[#818181] text-center mt-7" style={{ fontFamily: 'CircularStd', fontWeight: 500 }}>
                                This site is protected by reCAPTCHA and the Google <br />
                                <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === 3 && (
                <div className='bg-[#121212] min-h-screen pt-8 flex flex-col justify-center items-center text-white'>
                    <div>
                        <div className="flex justify-center">
                            <img src={Logo} alt="Logo" className="w-10 h-10 " />
                        </div>
                        <div className=' flex justify-center'>
                            <div className='relative text-white my-8 flex justify-center'>
                                <div className='absolute border-1 w-70 sm:w-100 border-[#818181]'></div>
                                <div className='absolute border-1 w-70 sm:w-100 border-green-400 '></div>
                            </div>
                        </div>
                        <div className='flex w-[250px] sm:w-[400px] items-center gap-1.5' style={{ fontFamily: 'CircularStd', fontWeight: 700 }}>
                            <button type="button" onClick={goBack}>
                                <IoIosArrowBack  className='text-zinc-400 text-[20px] sm:text-[30px]' />
                            </button>
                            <div>
                                <div className="text-zinc-400 text-xs sm:text-md" style={{ fontFamily: 'CircularStd', fontWeight: 400 }}>Step 1 of 2</div>
                                <div className="text-xs sm:text-md">Tell us about yourself</div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center my-6">
                            <form onSubmit={profileForm.handleSubmit(handleRegistration)} className="px-3">
                                <label className="text-sm sm:text-[14px] block" style={{ fontFamily: 'CircularStd', fontWeight: 900 }}>Name</label>
                                <span className="text-xs sm:text-[13px] font-light block text-zinc-400" style={{ fontFamily: 'CircularStd', fontWeight: 500 }}>This name will appear on your profile</span>
                                <input 
                                    type="text" 
                                    {...profileForm.register('name', {
                                        required: 'Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters long'
                                        }
                                    })}
                                    className="border-1 p-2 w-full sm:w-[320px] mt-2 rounded-sm border-[#818181]" 
                                />
                                {profileForm.formState.errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
                                )}

                                <label className="text-sm sm:text-[14px] block mt-5" style={{ fontFamily: 'CircularStd', fontWeight: 900 }}>Date of birth</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        inputMode="numeric" 
                                        placeholder="yyyy" 
                                        maxLength={4}
                                        {...profileForm.register('dobYear', {
                                            required: 'Year is required',
                                            pattern: {
                                                value: /^\d{4}$/,
                                                message: 'Please enter a valid year'
                                            },
                                            validate: {
                                                validYear: (value) => {
                                                    const year = parseInt(value);
                                                    const currentYear = new Date().getFullYear();
                                                    return (year >= 1900 && year <= currentYear) || 'Please enter a valid year';
                                                }
                                            }
                                        })}
                                        className="border-1 p-2 w-[70px] sm:w-[90px] mt-1 rounded-sm border-[#818181] no-spinner" 
                                    />
                                    <select
                                        {...profileForm.register('dobMonth', {
                                            required: 'Month is required'
                                        })}
                                        className="border p-2 w-[140px] sm:w-[155px] mt-1 rounded-sm border-[#818181] text-white bg-[#121212]"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select Month</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        inputMode="numeric" 
                                        maxLength={2} 
                                        placeholder="dd"
                                        {...profileForm.register('dobDay', {
                                            required: 'Day is required',
                                            pattern: {
                                                value: /^(0?[1-9]|[12][0-9]|3[01])$/,
                                                message: 'Please enter a valid day'
                                            }
                                        })}
                                        className="border-1 p-2 w-[45px] sm:w-[60px] mt-1 rounded-sm border-[#818181]" 
                                    />
                                </div>
                                {(profileForm.formState.errors.dobYear || profileForm.formState.errors.dobMonth || profileForm.formState.errors.dobDay) && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {
                                            profileForm.formState.errors.dobYear?.message || 
                                            profileForm.formState.errors.dobMonth?.message || 
                                            profileForm.formState.errors.dobDay?.message
                                        }
                                    </p>
                                )}

                                <label className="text-sm sm:text-[14px] block mt-5" style={{ fontFamily: 'CircularStd', fontWeight: 900 }}>Gender</label>
                                <span className="text-xs sm:text-[14px] font-light block text-zinc-400" style={{ fontFamily: 'CircularStd', fontWeight: 400 }}>
                                    We use your gender to help personalize our <br />
                                    content recommendations and ads for you.
                                </span>
                                <div className="mt-2 flex items-center gap-4 text-sm">
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="flex gap-7">
                                            <label className="flex items-center w-fit cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Man"
                                                    {...profileForm.register('gender', {
                                                        required: 'Please select a gender'
                                                    })}
                                                    className="peer hidden"
                                                />
                                                <div className="w-4 h-4 hover:border-green-400 rounded-full border-1 border-[#818181] bg-transparent peer-checked:bg-black peer-checked:border-4 peer-checked:border-green-500 transition-all"></div>
                                                <span className="ml-2 text-white">Man</span>
                                            </label>

                                            <label className="flex items-center w-fit cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Woman"
                                                    {...profileForm.register('gender')}
                                                    className="peer hidden"
                                                />
                                                <div className="w-4 h-4 hover:border-green-400 rounded-full border-1 border-[#818181] bg-transparent peer-checked:bg-black peer-checked:border-4 peer-checked:border-green-500 transition-all"></div>
                                                <span className="ml-2 text-white">Woman</span>
                                            </label>

                                            <label className="flex items-center w-fit cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Non-binary"
                                                    {...profileForm.register('gender')}
                                                    className="peer hidden"
                                                />
                                                <div className="w-4 h-4 hover:border-green-400 rounded-full border-1 border-[#818181] bg-transparent peer-checked:bg-black peer-checked:border-4 peer-checked:border-green-500 transition-all"></div>
                                                <span className="ml-2 text-white">Non-binary</span>
                                            </label>
                                        </div>

                                        <div className="flex gap-7">
                                            <label className="flex items-center w-fit cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Something else"
                                                    {...profileForm.register('gender')}
                                                    className="peer hidden"
                                                />
                                                <div className="w-4 h-4 hover:border-green-400 rounded-full border-1 border-[#818181] bg-transparent peer-checked:bg-black peer-checked:border-4 peer-checked:border-green-500 transition-all"></div>
                                                <span className="ml-2 text-white">Something else</span>
                                            </label>

                                            <label className="flex items-center w-fit cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="Prefer not to say"
                                                    {...profileForm.register('gender')}
                                                    className="peer hidden"
                                                />
                                                <div className="w-4 h-4 hover:border-green-400 rounded-full border-1 border-[#818181] bg-transparent peer-checked:bg-black peer-checked:border-4 peer-checked:border-green-500 transition-all"></div>
                                                <span className="ml-2 text-white">Prefer not to say</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {profileForm.formState.errors.gender && (
                                    <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.gender.message}</p>
                                )}

                                <button type="submit" className="w-[100%] text-center p-3 bg-[#1ed760] text-black rounded-full mt-12" style={{ fontFamily: 'CircularStd', fontWeight: 800 }}>
                                    Sign up
                                </button>
                            </form>

                            <div className="text-xs sm:text-[13px] text-[#818181] text-center mt-7" style={{ fontFamily: 'CircularStd', fontWeight: 500 }}>
                                This site is protected by reCAPTCHA and the Google <br />
                                <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Signup;