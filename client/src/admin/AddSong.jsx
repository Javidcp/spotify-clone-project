import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import api from "../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddSong = () => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting, },
    } = useForm({ mode: "onChange" });

    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchArtists = async () => {
        try {
            const [artistRes, genreRes] = await Promise.all([
                api.get("/artist/artistname"),
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
            console.error("Failed to fetch artists:", err);
        }
        };
        fetchArtists();
    }, []);

    const artistOptions = artists.map((artist) => ({
        value: artist._id,
        label: artist.name,
    }));

    const onSubmit = async (formData) => {
        const token = localStorage.getItem("accessToken");
        console.log("Token:", token);

        const data = new FormData();

        data.append("title", formData.title);
        data.append("artist", formData.artist.value);
        data.append("coverImage", formData.coverImage[0]);
        data.append("duration", formData.duration);
        data.append("url", formData.url[0]);
        data.append("genre", formData.genre || "");

        try {
        await api.post("/songs/add", data, {
            headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            },
        });
        toast.success("Song added!");
        navigate('/admin/songs')
        reset();
        } catch (err) {
        console.error(err);
        toast.error("Failed to add song.");
        }
    };

    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center items-center mx-auto min-h-screen text-white"
        >
        <div className="flex flex-col space-y-1 bg-[#1e1e1e] p-6 rounded-lg mt-5 w-96">
            <label className="text-xs mt-1">Title:</label>
            <input
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="Title"
            className={`border p-2 rounded-md ${
                errors.title ? "border-red-500" : "border-[#696969]"
            }`}
            />
            {errors.title && (
            <p className="text-red-400 text-xs">{errors.title.message}</p>
            )}

            <label className="text-xs mt-1">Artist:</label>
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
            {errors.artist && (
                <p className="text-red-400 text-xs">{errors.artist.message}</p>
            )}

            <label className="text-xs mt-1">Cover Image (only images):</label>
            <input
                {...register("coverImage", {
                    required: "Cover image is required",
                    validate: {
                    isImage: (files) =>
                        files?.[0]?.type.startsWith("image/")
                        ? true
                        : "Only image files are allowed",
                    },
                })}
                type="file"
                accept="image/*"
                className={`border p-2 rounded-md ${
                    errors.coverImage ? "border-red-500" : "border-[#696969]"
                }`}
            />
            {errors.coverImage && (
                <p className="text-red-400 text-xs">{errors.coverImage.message}</p>
            )}

            <label className="text-xs mt-1">Duration (mm:ss):</label>
            <input
                {...register("duration", {
                    required: "Duration is required",
                    pattern: {
                    value: /^[0-9]{2}:[0-5][0-9]$/,
                    message: "Duration format should be mm:ss",
                    },
                })}
                type="text"
                placeholder="Duration (e.g. 03:45)"
                className={`border p-2 rounded-md ${
                    errors.duration ? "border-red-500" : "border-[#696969]"
                }`}
            />
            {errors.duration && (
                <p className="text-red-400 text-xs">{errors.duration.message}</p>
            )}

            <label className="text-xs mt-1">Song File (only audio):</label>
            <input
                {...register("url", {
                    required: "Song file is required",
                    validate: {
                    isAudio: (files) =>
                        files?.[0]?.type.startsWith("audio/")
                        ? true
                        : "Only audio files are allowed",
                    },
                })}
                type="file"
                accept="audio/*"
                className={`border p-2 rounded-md ${
                    errors.url ? "border-red-500" : "border-[#696969]"
                }`}
            />
            {errors.url && (
                <p className="text-red-400 text-xs">{errors.url.message}</p>
            )}

            <label className="text-xs mt-1">Genre:</label>
            <select
                {...register("genre", { required: "Genre is required" })}
                className={`border p-2 rounded-md ${
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
            {errors.genre && (
                <p className="text-red-400 text-xs">{errors.genre.message}</p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className={`p-3 mt-2 font-mono rounded-lg ${
                    isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-400 text-black hover:bg-green-300"
                }`}
            >
            {isSubmitting ? "Adding..." : "Add Song"}
            </button>
        </div>
        </form>
    );
};

export default AddSong;