/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCreateArtist = () => {
    const { register, handleSubmit, reset, formState: { isSubmitting, isValid, isDirty, errors }, watch } = useForm({ mode: 'onChange' });
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', data.image[0]);

        try {
            const res = await api.post('/artist/add', formData, { headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(`Artist "${res.data.name}" created successfully!`);
            navigate('/admin/artist')
            reset();
        } catch (err) {
            
    console.log('Error response:', err.response);
            toast.error(err.response?.data?.message || 'Something went wrong');
            setError(err.message)
        }
    };
    const selectedImage = watch('image')?.[0];

    return (
        <div className='text-white flex justify-center min-h-screen items-center'>
            <form onSubmit={handleSubmit(onSubmit)} className='w-80 p-6 rounded-lg bg-[#1e1e1e]' encType="multipart/form-data">
                <h2 className="text-lg font-semibold mb-4 text-center">Create New Artist</h2>

                <label className="text-xs">Artist Name:</label>
                <input
                    type="text"
                    placeholder="Artist Name"
                    className={`placeholder:text-[#696969] rounded-md border p-2 w-full mb-1 ${
                        errors.name ? 'border-red-500' : 'border-[#696969]'
                    }`}
                    {...register('name', {
                        required: 'Name is required',
                        pattern: {
                            value: /^[A-Za-z\s]+$/,
                            message: 'Name cannot contain numbers or special characters',
                        },
                    })}
                />
                {errors.name && <p className="text-red-400 text-xs mb-2">{errors.name.message}</p>}

                <label className="text-xs">Cover Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    className={`text-sm text-[#ccc] rounded-md border p-2 w-full mb-1 ${
                        errors.image ? 'border-red-500' : 'border-[#696969]'
                    }`}
                    {...register('image', {
                        required: 'Image is required',
                        validate: {
                            isImage: (fileList) =>
                                fileList && fileList[0] && fileList[0].type.startsWith('image/')
                                    ? true
                                    : 'Only image files are allowed',
                        },
                    })}
                />
                {errors.image && <p className="text-red-400 text-xs mb-2">{errors.image.message}</p>}

                <button
                    type="submit"
                    disabled={!isDirty || !isValid || isSubmitting}
                    className={`w-full p-3 mt-3 text-black font-mono rounded-md transition ${
                        !isDirty || !isValid || isSubmitting
                            ? 'bg-[#494949] text-red-100 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-400'
                    }`}
                >
                    {isSubmitting ? 'Creating...' : 'Create Artist'}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateArtist;