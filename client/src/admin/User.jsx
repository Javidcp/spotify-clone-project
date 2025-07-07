import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/axios";



const USERS_PER_PAGE = 10;

const User = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user || user.role !== "admin") {
        toast.error("Access Denied");
        navigate("/");
        return;
        }

        const fetchData = async () => {
        try {
            const res = await api.get("/auth/users");
            const filteredUsers = res.data.filter(u => u.role !== "admin");
            setUsers(filteredUsers);
            console.log(res.data);
        } catch (err) {
            toast.error("Failed to fetch user data", err);
        }
        };

        fetchData();
    }, [user, navigate]);

        const toggleBlockUser = async (id, currentStatus) => {
        try {
            const response = await api.patch(`/auth/users/${id}`, {
                isActive: !currentStatus,
            });

            setUsers((prev) =>
                prev.map((u) =>
                    u._id === id ? { ...u, isActive: response.data.isActive } : u
                )
            );
        } catch (error) {
            console.error("Block/Unblock error:", error);
        }
    };

    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const paginatedUsers = users.slice(startIndex, startIndex + USERS_PER_PAGE);

    return (
        <div className=" text-white min-h-screen">
            <h3 className="text-2xl font-bold text-center mt-20 mb-10">Registered Users</h3>
            <table className="min-w-full border-collapse border border-[#191919]">
                <thead>
                <tr className="bg-[#1d1d1d] text-left">
                    <th className="border border-[#696969] p-2 w-10 text-center">#</th>
                    <th className="border border-[#696969] p-2">Name</th>
                    <th className="border border-[#696969] p-2">Email</th>
                    <th className="border border-[#696969] p-2 w-[150px] text-center">Premium</th>
                    <th className="border border-[#696969] p-2 w-[150px] text-center">Status</th>
                </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center p-4">
                                No users found
                            </td>
                        </tr>
                    ) : (
                        paginatedUsers.map((u, idx) => (
                            <tr key={u._id} className="border-b border-[#191919]">
                                <td className="p-2 border border-[#191919] text-center">{startIndex + idx + 1}</td>
                                <td className="p-2">{u.username}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2 text-center">{u.isPremium ? "Yes" : "No"}</td>
                                <td className="p-2 flex justify-center">
                                    <button onClick={() => toggleBlockUser(u._id, u.isActive)}>
                                        {u.isActive ? (
                                            <button className="bg-green-600 px-4 py-1 rounded-md">Block</button>
                                        ) : (
                                            <button className="bg-red-600 px-4 py-1 rounded-md">Unblock</button>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-center mt-6 space-x-2">
                <button className="px-3 py-1 bg-[#191919] rounded disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${ currentPage === i + 1 ? "bg-[#1ED760]" : "bg-[#191919]" }`}>
                        {i + 1}
                    </button>
                ))}

                <button className="px-3 py-1 bg-[#191919] rounded disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} >
                    Next
                </button>
            </div>
        </div>
    );
};

export default User;
