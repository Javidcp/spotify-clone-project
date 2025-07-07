/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditArtist = () => {
    const { artistId } = useParams();
    const navigate = useNavigate();
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { isSubmitting, isValid, isDirty, errors },
        watch,
    } = useForm({ mode: 'onChange' });

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const res = await api.get(`/artist/${artistId}`);
                setValue('name', res.data.name);
                setPreview(res.data.image);
            } catch (err) {
                toast.error('Failed to fetch artist');
                navigate('/admin/artist');
            }
        };

        fetchArtist();
    }, [artistId, setValue, navigate]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.image?.[0]) {
            formData.append('image', data.image[0]);
        }

        try {
            const res = await api.patch(`/artist/updateArtist/${artistId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(`Artist "${res.data.name}" updated successfully!`);
            navigate('/admin/artist');
        } catch (err) {
            console.log('Error response:', err.response);
            toast.error(err.response?.data?.message || 'Something went wrong');
            setError(err.message);
        }
    };

    const selectedImage = watch('image')?.[0];

    return (
        <div className="text-white flex justify-center min-h-screen items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-80 p-6 rounded-lg bg-[#1e1e1e]"
                encType="multipart/form-data"
            >
                <h2 className="text-lg font-semibold mb-4 text-center">Edit Artist</h2>

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
                            message: 'Only letters and spaces allowed',
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
                        validate: {
                            isImage: (fileList) =>
                                !fileList.length || fileList[0]?.type.startsWith('image/')
                                    ? true
                                    : 'Only image files are allowed',
                        },
                    })}
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            setPreview(URL.createObjectURL(e.target.files[0]));
                        }
                    }}
                />
                {errors.image && <p className="text-red-400 text-xs mb-2">{errors.image.message}</p>}

                {preview && (
                    <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded mt-2 mb-2 mx-auto" />
                )}

                <button
                    type="submit"
                    disabled={!isDirty || !isValid || isSubmitting}
                    className={`w-full p-3 mt-3 text-black font-mono rounded-md transition ${
                        !isDirty || !isValid || isSubmitting
                            ? 'bg-[#494949] text-red-100 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-400'
                    }`}
                >
                    {isSubmitting ? 'Updating...' : 'Update Artist'}
                </button>
            </form>
        </div>
    );
};

export default EditArtist;
