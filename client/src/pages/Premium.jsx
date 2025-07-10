import React, { useState } from 'react';
import Logo from "../assets/spotify_icon-white.png"
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


export default function Premium() {

    const [ couponCode, setCouponCode ] = useState("")
const userId = useSelector((state) => state.auth.user?._id);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const plans = [
        {
        id: 'price_1RhNR4AWND4Xw4ecSE8UgTnq',
        name: 'Individual',
        price: '₹59',
        duration: '3 months',
        regularPrice: '₹119',
        regularDuration: 'month',
        bgColor: 'bg-pink-300',
        buttonColor: 'bg-pink-300 hover:bg-pink-400',
        textColor: 'text-black',
        features: [
            '1 Premium account',
            'Cancel anytime',
            'Subscribe or one-time payment'
        ],
        offer: '₹59 for 3 months, then ₹119 per month after. Offer only available if you haven\'t tried Premium before.',
        terms: 'Terms apply.'
        },
        {
        id: 'price_1RhNfxAWND4Xw4ecse8pab9o',
        name: 'Family',
        price: '₹179',
        duration: '2 months',
        regularPrice: '₹179',
        regularDuration: 'month',
        bgColor: 'bg-blue-300',
        buttonColor: 'bg-blue-300 hover:bg-blue-400',
        textColor: 'text-black',
        features: [
            'Up to 6 Premium accounts',
            'Control content marked as explicit',
            'Cancel anytime',
            'Subscribe or one-time payment'
        ],
        offer: '₹179 for 2 months, then ₹179 per month after. Offer only available if you haven\'t tried Premium before. For up to 6 family members residing at the same address.',
        terms: 'Terms apply.'
        },
        {
        id: 'price_1RhNgoAWND4Xw4ecOYX4plwY',
        name: 'Duo',
        price: '₹149',
        duration: '2 months',
        regularPrice: '₹149',
        regularDuration: 'month',
        bgColor: 'bg-yellow-300',
        buttonColor: 'bg-yellow-300 hover:bg-yellow-400',
        textColor: 'text-black',
        features: [
            '2 Premium accounts',
            'Cancel anytime',
            'Subscribe or one-time payment'
        ],
        offer: '₹149 for 2 months, then ₹149 per month after. Offer only available if you haven\'t tried Premium before. For couples who reside at the same address.',
        terms: 'Terms apply.'
        },
        {
        id: 'price_1RhNh7AWND4Xw4eciyaR6RqA',
        name: 'Student',
        price: '₹59',
        duration: '2 months',
        regularPrice: '₹59',
        regularDuration: 'month',
        bgColor: 'bg-[#a5bbd1]',
        buttonColor: 'bg-[#a5bbd1] hover:bg-[#b5c7d9]',
        textColor: 'text-black',
        features: [
            '1 verified Premium account',
            'Discount for eligible students',
            'Cancel anytime',
            'Subscribe or one-time payment'
        ],
        offer: '₹149 for 2 months, then ₹149 per month after. Offer only available if you haven\'t tried Premium before. For couples who reside at the same address.',
        terms: 'Terms apply.'
        }
    ];

    const handleCheckout = async (priceId) => {
        try {
            const res = await api.post("/create-checkout-session", {
                priceId,
                couponCode: couponCode.trim() || null,
                userId
            })
            console.log(userId, "ff");
            
            window.location.href = res.data.url
        } catch (err) {
            console.error("Error creating checkout session:", err.response?.data || err.message);
            toast.error("Payment session created failed")
        }
    }

    return (
        <>
        <div className="min-h-screen bg-[#121212] rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#a40e7c] to-[#1f2b6d] px-6 py-16">
            <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Try 3 months of Premium for ₹59.00
            </h1>
            <p className="text-xl mb-8 opacity-90">
                Only ₹119/month after. Cancel anytime.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button className="bg-white text-black px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors">
                Try 3 months for ₹59
                </button>
                <button onClick={() => scrollToSection("plans")} className="border border-white text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-white hover:text-black transition-colors">
                View all plans
                </button>
            </div>
            
            <p className="text-sm opacity-75 max-w-3xl mx-auto">
                Premium Individual only. ₹59 for 3 months, then ₹119 per month after. Offer only available if you haven't tried Premium before. <span className="underline cursor-pointer">Terms apply.</span> Offer ends July 2, 2025.
            </p>
            </div>
        </div>

        <div className=" px-6 py-16 text-center text-white">
            <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Affordable plans for any situation
            </h2>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
                Choose a Premium plan and listen to ad-free music without limits on your phone, 
                speaker, and other devices. Pay in various ways. Cancel anytime.
            </p>
            </div>

            <div className="flex justify-center items-center gap-4 mb-4">
                <div className="bg-white h-8 w-15 flex justify-center rounded-md py-0.5">
                    <img src="https://paymentsdk.spotifycdn.com/svg/providers/upi/upi.svg" width={50} alt="" />
                </div>
                <div className="bg-white h-8 w-15 flex justify-center rounded-md py-0.5">
                    <img src="https://paymentsdk.spotifycdn.com/svg/providers/upi/phonepe.svg" width={50} alt="" />
                </div>
                <div className="bg-white h-8 w-15 flex justify-center rounded-md py-0.5">
                    <img src="https://paymentsdk.spotifycdn.com/svg/providers/upi/google-pay.svg" width={50} alt="" />
                </div>
                <div className="bg-white h-8 w-15 flex justify-center rounded-md py-0.5">
                    <img src="https://paymentsdk.spotifycdn.com/svg/providers/upi/paytm.svg" width={50} alt="" />
                </div>
            </div>
        </div>

        <div className='flex justify-center mb-15'>
            <div className='grid grid-cols-2 text-white items-center gap-10'>
                <div>
                    <h2 className='text-3xl font-bold'>All Premium plans include</h2>
                </div>
                <div>
                    <div className='flex items-center gap-1 '>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Ad-free music listening</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Download to listen offline</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Play songs in any order</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>High audio quality</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Listen with friends in real time</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Organize listening queue</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Listening insights (not in Mini)</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-center items-center  my-4">
            <div className='border border-[#494949] rounded overflow-hidden'>
                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="px-4 py-2 rounded-md  text-white focus:outline-none"
                />
                <button
                    onClick={() => setCouponCode("")}
                    className="text-sm text-white  bg-red-500 p-2.5 hover:underline"
                >
                    Clear
                </button>
            </div>
        </div>

        <section className=" px-6 pb-16" id="plans">
            <div className=" ">
            <div className=" flex flex-wrap justify-center gap-5">
                {plans.map((plan) => (
                <div key={plan.id} className="bg-[#1a1a1a] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg p-6 text-white relative overflow-hidden">
                    
                    <div className={`absolute top-0 left-0 ${plan.bgColor} ${plan.textColor} px-4 py-2 rounded-br-lg text-sm font-medium`}>
                    {plan.price} for {plan.duration}
                    </div>

                    <div className="mt-12 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className=" rounded-full flex items-center justify-center">
                        <div className=" bg-black rounded-full flex items-center justify-center">
                            <img src={Logo} className='w-6 h-6' alt="" />
                        </div>
                        </div>
                        <span className="text-white font-medium">Premium</span>
                    </div>
                    <h2 className={`text-4xl font-bold mb-2`} style={{color: plan.bgColor.includes('pink') ? '#f9a8d4' : plan.bgColor.includes('blue') ? '#93c5fd' : '#fde047'}}>
                        {plan.name}
                    </h2>
                    <div className="text-white">
                        <div className="text-lg font-medium">{plan.price} for {plan.duration}</div>
                        <div className="text-gray-400 text-sm">{plan.regularPrice} / {plan.regularDuration} after</div>
                    </div>
                    </div>

                    <div className="mb-8">
                    <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-white text-sm">{feature}</span>
                        </li>
                        ))}
                    </ul>
                    </div>

                    <button onClick={() => handleCheckout(plan.id)} className={`w-full ${plan.buttonColor} ${plan.textColor} py-3 px-6 rounded-full font-medium text-lg transition-colors mb-6`}>
                    Try {plan.duration} for {plan.price}
                    </button>

                    <div className="text-xs text-gray-400 space-y-1">
                    <p className='text-center'>{plan.offer} <span className="underline cursor-pointer">{plan.terms}</span></p>
                    
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>

            <div className=" px-2 py-16">
                <div className="max-w-2xl mx-auto text-white">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Experience the difference
                        </h2>
                        <p className="textmd opacity-80">
                        Go Premium and enjoy full control of your listening. Cancel anytime.
                        </p>
                    </div>

                <div className="overflow-hidden  border-b border-white">
                    <div className="grid grid-cols-3">
                    <div className="p-3">
                        <h3 className="text-xl font-medium text-white">What you'll get</h3>
                    </div>
                    <div className="p-3 text-center ">
                        <div className="text-lg font-medium text-white ">Spotify's</div>
                        <div className="text-lg font-medium text-white">Free plan</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                        <div className=" rounded-full flex items-center justify-center">
                        <div className=" bg-black rounded-full flex items-center justify-center">
                            <img src={Logo} className='w-6 h-6' alt="" />
                        </div>
                        </div>
                        <span className="text-lg font-medium text-white">Premium</span>
                        </div>
                    </div>
                    </div>

                    {[
                    'Ad-free music listening',
                    'Download songs',
                    'Play songs in any order',
                    'High quality audio',
                    'Listen with friends in real time',
                    'Organize listening queue',
                    'Listening insights'
                    ].map((feature, index) => (
                    <div key={index} className="grid grid-cols-3 border-b border-white">
                        <div className="pt-3 border-white">
                        <span className="text-white font-medium">{feature}</span>
                        </div>
                        <div className="p-3 text-center  border-white">
                        <div className="w-6 h-6 pt-3 mx-auto">
                            <div className="w-full h-0.5 bg-[#1f1f1f]"></div>
                        </div>
                        </div>
                        <div className="pt-3 text-center">
                        <div className="w-6 h-6 mx-auto bg-white rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>

        </div>
        </>
    );
}