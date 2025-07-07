import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import api from "../utils/axios";
import { nanoid } from "nanoid"
import { useEffect, useState } from "react";


const Coupan = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm()
    const [ isOpen, setIsOpen ] = useState(false)
    const [ items, setItems ] = useState([])
    const [ showActions, setShowActions ] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingCouponId, setEditingCouponId] = useState(null);


    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await api.get('/coupon')
                setItems(res.data)
            } catch (err) {
                console.error("Error in fetching coupons:", err.message);
            }
        }
        fetchCoupons()
    }, [items])
    
    useEffect(() => {
        const code = generateCouponCode()
        setValue('code', code)
    }, [])
    
    const generateCouponCode = () => {
        return `SAVE-${nanoid(6).toUpperCase()}`
    }

const onSubmit = async (data) => {
    try {
        data.discountValue = parseFloat(data.discountValue);
        data.minOrderAmount = parseFloat(data.minOrderAmount || 0);
        data.maxDiscountAmount = data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null;
        data.maxUses = data.maxUses ? parseInt(data.maxUses) : null;

        if (editMode) {
            await api.put(`/coupon/${editingCouponId}`, data);
            toast.success("Coupon updated successfully");
        } else {
            await api.post('/coupon', data);
            toast.success("Coupon created successfully");
        }


        reset();
        setIsOpen(false);
        setEditMode(false);
        setEditingCouponId(null);
    } catch (error) {
        console.error(error);
        toast.error(editMode ? "Error updating coupon" : "Error creating coupon");
    }
};



    const handleCardClick = (couponId) => {
        setShowActions(prev => prev === couponId ? null : couponId);
    };

    const handleEdit = (e, item) => {
        e.stopPropagation();
        setIsOpen(true);
        setEditMode(true);
        setEditingCouponId(item._id);
        setShowActions(false);
        
        setValue('code', item.code);
        setValue('discountType', item.discountType);
        setValue('discountValue', item.discountValue);
        setValue('minOrderAmount', item.minOrderAmount);
        setValue('maxDiscountAmount', item.maxDiscountAmount || '');
        setValue('startDate', item.startDate.slice(0, 10)); 
        setValue('endDate', item.endDate.slice(0, 10));
        setValue('maxUses', item.maxUses || '');
        setValue('isActive', item.isActive);
    };


    const handleDelete = async (e, couponId) => {
        try {
            await api.delete(`/coupon/${couponId}`)
            setItems((prev) => prev.filter((item) => item._id !== couponId))

            toast.success("Coupon deleted successfully")
            setShowActions(null);
        } catch (err) {
            toast.error("Error in deleting:", err.message)
        }
    };



    return (
        <div className=' min-h-screen text-white mt-15 '>
            {isOpen &&
                <div className="flex items-center justify-center ">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#1e1e1e] p-5 max-w-md space-y-5 rounded-lg mb-10">
                        <h2 className="text-center text-2xl font-bold mb-8">Create Coupon</h2>
                        <span className="text-xs font-semibold">Coupon code:</span>
                        <div className="flex justify-between mt-1">
                            <input 
                                {...register('code')}
                                readOnly
                                className="border p-2 text-center rounded-md"
                            />
                            <button type="button" onClick={() => setValue('code', generateCouponCode())} className="text-sm bg-[#1ED760] px-3 rounded">
                                Regenerate Code
                            </button>
                        </div>
                        { errors.code && <p className="text-red-500">{errors.code.message}</p> }
                        <input
                            {...register('discountType')}
                            value="percentage"
                            disabled
                            className="w-full p-2 border rounded  text-gray-700"
                        />
                        <input
                            type="number"
                            step="0.01"
                            {...register('discountValue', { required: 'Discount value is required', min: 0 })}
                            placeholder="Discount Value"
                            className="w-full p-2 border rounded"
                        />
                        {errors.discountValue && <p className="text-red-500">{errors.discountValue.message}</p>}

                        <input
                            type="number"
                            step="0.01"
                            {...register('minOrderAmount')}
                            placeholder="Minimum Order Amount"
                            className="w-full p-2 border rounded"
                        />

                        <input
                            type="number"
                            step="0.01"
                            {...register('maxDiscountAmount')}
                            placeholder="Maximum Discount Amount"
                            className="w-full p-2 border rounded"
                        />

                        <label>
                            <span className="text-xs font-semibold">Start Date:</span>
                            <input
                                type="date"
                                {...register('startDate')}
                                className="w-full p-2 border rounded"
                            />
                        </label>

                        <label className="mt-3 block">
                            <span className="text-xs font-semibold">End Date:</span>
                            <input
                                type="date"
                                {...register('endDate', { required: 'End date is required' })}
                                className="w-full p-2  border rounded text-white"
                            />
                        </label>
                        {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}

                        <input
                            type="number"
                            {...register('maxUses')}
                            placeholder="Maximum Uses"
                            className="w-full p-2 border rounded mt-1"
                        />

                        <label className="flex items-center space-x-2">
                            <input type="checkbox" {...register('isActive')} defaultChecked />
                            <span>Active</span>
                        </label>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            {editMode ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                onClick={() => {
                                reset();
                                setEditMode(false);
                                setEditingCouponId(null);
                                }}
                                className="w-full mt-2 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>
            }
            <div className="">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Coupon Section</h2>
                    <button onClick={() => setIsOpen(prev => !prev)} className={`p-2 rounded w-35 ${isOpen ? 'bg-red-500': 'bg-blue-500'}`}>
                        {isOpen ? 'Close' : 'Create Coupon'}
                    </button>
                </div>
                <div className="mt-5">
                    {items.map(item => (
                        <div 
                            key={item._id} 
                            onClick={() => handleCardClick(item._id)}
                            className="flex mb-4 relative justify-between p-6 rounded-lg bg-[#121212] border border-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Code</span>
                                <span className="text-lg font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text ">
                                {item.code}
                                </span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Discount</span>
                                <span className="text-2xl font-bold text-green-400">{item.discountValue}%</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Min Order</span>
                                <span className="text-sm font-semibold text-gray-200">₹ {item.minOrderAmount}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Max Discount</span>
                                <span className="text-sm font-semibold text-gray-200">₹ {item.maxDiscountAmount}</span>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Valid Period</span>
                                <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-300">{item.startDate.slice(0, 10)}</span>
                                <span className="text-xs text-gray-500">to</span>
                                <span className="text-xs text-gray-300">{item.endDate.slice(0, 10)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Usage</span>
                                <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-blue-400">{item.currentUses}</span>
                                <span className="text-xs text-gray-500">/</span>
                                <span className="text-sm font-semibold text-gray-300">{item.maxUses}</span>
                                </div>
                                <div className="w-12 h-1 bg-gray-700 rounded-full mt-1">
                                <div 
                                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((item.currentUses / item.maxUses) * 100, 100)}%` }}
                                ></div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Status</span>
                                <div className="flex items-center gap-2 mt-1">
                                <div className={`w-3 h-3 rounded-full ${item.isActive ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-500 shadow-lg shadow-red-500/50'}`}></div>
                                <span className={`text-xs font-medium ${item.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.isActive ? 'Active' : 'Inactive'}
                                </span>
                                </div>
                            </div>
                            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center gap-4 transition-all duration-300 ${showActions === item._id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <button
                                onClick={(e) => handleEdit(e, item)}
                                className="flex items-center w-30 text-center justify-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                            >
                                Edit
                            </button>
                            
                            <button
                                onClick={(e) => handleDelete(e, item._id)}
                                className="flex items-center w-30 text-center justify-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                            >
                                Delete
                            </button>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Coupan