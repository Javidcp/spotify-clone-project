/* eslint-disable no-unused-vars */
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditSong = () => {
    const { songId } = useParams();
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState('');
    const [previewAudio, setPreviewAudio] = useState('');
    const [error, setError] = useState('');
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { isSubmitting, isValid, isDirty, errors },
        watch,
    } = useForm({ mode: 'onChange' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artistRes, genreRes] = await Promise.all([
                    api.get("/artist"),
                    api.get("/genreName"),
                ]);

                const sortedArtists = artistRes.data.sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                );
                setArtists(sortedArtists);

                const sortedGenres = genreRes.data.sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                );
                setGenres(sortedGenres);
            } catch (err) {
                console.error("Failed to fetch artists or genres:", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const res = await api.get(`/songs/${songId}`);
                const song = res.data;
                setValue('title', song.title);
                setValue('duration', song.duration);
                setValue('playCount', song.playCount);
                
                if (song.genre) {
                    setValue('genre', song.genre.name);
                }
                
                if (song.artist && song.artist.length > 0) {
                    setValue('artist', { value: song.artist[0]._id, label: song.artist[0].name });
                }
                
                setPreviewImage(song.coverImage);
                setPreviewAudio(song.url);
            } catch (err) {
                toast.error('Failed to fetch song');
                navigate('/admin/songs');
            }
        };

        if (artists.length > 0 && genres.length > 0) {
            fetchSong();
        }
    }, [songId, setValue, navigate, artists, genres]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('duration', data.duration);
        formData.append('genre', data.genre);
        formData.append('artist', data.artist.value);

        if (data.coverImage?.[0]) {
            formData.append('coverImage', data.coverImage[0]);
        }

        if (data.songFile?.[0]) {
            formData.append('url', data.songFile[0]);
        }

        console.log('Updating song with ID:', songId);

        try {
            const res = await api.put(`/songs/update/${songId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success(`Song "${res.data.title}" updated successfully!`);
            navigate('/admin/songs');
        } catch (err) {
            console.log('Error:', err.response);
            toast.error(err.response?.data?.message || 'Something went wrong');
            setError(err.message);
        }
    };

    const selectedCover = watch('coverImage')?.[0];
    const selectedAudio = watch('songFile')?.[0];

    useEffect(() => {
        if (selectedCover) {
            setPreviewImage(URL.createObjectURL(selectedCover));
        }
    }, [selectedCover]);

    useEffect(() => {
        if (selectedAudio) {
            setPreviewAudio(URL.createObjectURL(selectedAudio));
        }
    }, [selectedAudio]);

    const artistOptions = artists.map((artist) => ({
        value: artist._id,
        label: artist.name,
    }));

    return (
        <div className="text-white flex justify-center min-h-screen items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-96 p-6 rounded-lg bg-[#1e1e1e]"
                encType="multipart/form-data"
            >
                <h2 className="text-lg font-semibold mb-4 text-center">Edit Song</h2>

                <label className="text-xs">Title:</label>
                <input
                    type="text"
                    placeholder="Song title"
                    className={`placeholder:text-[#696969] rounded-md border p-2 w-full mb-1 ${
                        errors.title ? 'border-red-500' : 'border-[#696969]'
                    }`}
                    {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <p className="text-red-400 text-xs mb-2">{errors.title.message}</p>}

                <label className="text-xs">Duration:</label>
                <input
                    type="text"
                    placeholder="e.g., 3:45"
                    className={`placeholder:text-[#696969] rounded-md border p-2 w-full mb-1 ${
                        errors.duration ? 'border-red-500' : 'border-[#696969]'
                    }`}
                    {...register('duration', { 
                        required: 'Duration is required',
                        pattern: {
                            value: /^[0-9]{1,2}:[0-5][0-9]$/,
                            message: "Duration format should be m:ss or mm:ss",
                        }
                    })}
                />
                {errors.duration && <p className="text-red-400 text-xs mb-2">{errors.duration.message}</p>}

                <label className="text-xs">Artist:</label>
                <Controller
                    name="artist"
                    control={control}
                    rules={{ required: "Artist is required" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={artistOptions}
                            placeholder="Select Artist"
                            isClearable
                            filterOption={(option, inputValue) =>
                                option.label.toLowerCase().includes(inputValue.toLowerCase())
                            }
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#1e1e1e",
                                    borderColor: errors.artist ? "red" : "#696969",
                                    color: "white",
                                    marginBottom: "4px"
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#121212",
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isFocused ? "#333" : "#121212",
                                    color: "white",
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: "white",
                                }),
                            }}
                        />
                    )}
                />
                {errors.artist && <p className="text-red-400 text-xs mb-2">{errors.artist.message}</p>}

                <label className="text-xs">Genre:</label>
                <select
                    {...register("genre", { required: "Genre is required" })}
                    className={`border p-2 rounded-md w-full mb-1 ${
                        errors.genre ? "border-red-500" : "border-[#696969]"
                    } bg-[#1e1e1e]`}
                >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                        <option key={genre._id} value={genre.name}>
                            {genre.name}
                        </option>
                    ))}
                </select>
                {errors.genre && <p className="text-red-400 text-xs mb-2">{errors.genre.message}</p>}

                <label className="text-xs">Cover Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    className="text-sm text-[#ccc] rounded-md border p-2 w-full mb-1 border-[#696969]"
                    {...register('coverImage')}
                />
                {previewImage && (
                    <img src={previewImage} alt="cover" className="w-24 h-24 object-cover rounded mt-2 mx-auto mb-2" />
                )}

                <label className="text-xs">Audio File:</label>
                <input
                    type="file"
                    accept="audio/*"
                    className="text-sm text-[#ccc] rounded-md border p-2 w-full mb-1 border-[#696969]"
                    {...register('songFile')}
                />
                {previewAudio && (
                    <audio controls src={previewAudio} className="w-full mt-2 mb-2" />
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
                    {isSubmitting ? 'Updating...' : 'Update Song'}
                </button>
            </form>
        </div>
    );
};

export default EditSong;