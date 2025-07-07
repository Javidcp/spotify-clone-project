import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/axios";
import Spotify1 from "../assets/spoti-1.jpg"
import Spotify2 from "../assets/spoti-2.jpg"
import Spotify3 from "../assets/spoti-3.jpg"
import Spotify4 from "../assets/spoti-4.jpg"

const Dashboard = () => {
    const [ users, setUsers ] = useState([])
    const [ songs, setSongs ] = useState([])
    const [ artists, setArtists ] = useState([])
    const { user, isLoading } = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const [ userData, setUserData ] = useState([])

    useEffect(() => {
        if (isLoading) return;

        if (!user || user.role !== "admin") {
            toast.error("Access Denied");
            navigate('/')
            return;
        }

        const fetchData = async () => {
            try {
                const [userRes, songRes, artistRes] = await Promise.all([
                    api.get('/auth/users'),
                    api.get('/songs'),
                    api.get('/artist')
                ])
                setUsers(userRes.data)
                setSongs(songRes.data.data)
                setArtists(artistRes.data.data)
            } catch (err) {
                toast.error("Failed to fetch user data", err);
            }
        };

        fetchData();
    }, [user, isLoading, navigate]);

    useEffect(() => {
        const fetchUserStats = async () => {
            try{
                const res = await api.get('/auth/user-stats')
                setUserData(res.data)
            } catch (err) {
                console.error("Error fetch user stats:", err);
            }
        }

        fetchUserStats()
    }, [])

    const dates = userData.map( stat => stat.date );
    const counts = userData.map( stat => stat.count );


    return (
        <div className="text-white min-h-screen mt-15">
            <div className="space-y-2 flex flex-col items-center ">
                <div className="flex gap-2">
                    <div className="w-120 h-40 font-bold rounded-tl-2xl  flex flex-col items-center justify-center" style={{backgroundImage: `url(${Spotify1})`, backgroundPosition: 'bottom right', backgroundSize: 'cover'}}>
                        <p className="text-5xl">{users.length}</p>
                        <p className="text-xl">Total User</p>
                    </div>
                    <div className="w-120 h-40 rounded-tr-2xl flex flex-col items-center justify-center font-bold" style={{backgroundImage: `url(${Spotify2})`, backgroundPosition: 'bottom right', backgroundSize: 'cover'}}>
                        <p className="text-5xl">{songs.length || 0}</p>
                        <p className="text-xl">Total Songs</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="w-120 h-40 rounded-bl-2xl flex flex-col items-center justify-center font-bold" style={{backgroundImage: `url(${Spotify3})`, backgroundPosition: 'top right', backgroundSize: 'cover'}}>
                        <p className="text-5xl">{artists.length || 0}</p>
                        <p className="text-xl">Total Artist</p>
                    </div>
                    <div className="w-120 h-40 rounded-br-2xl flex flex-col items-center justify-center font-bold" style={{backgroundImage: `url(${Spotify4})`, backgroundPosition: 'top right', backgroundSize: 'cover'}}>
                        <p className="text-5xl">{songs.reduce((acc, song) => acc + (song.playCount || 0), 0)}</p>
                        <p className="text-xl">Total Playcount</p>
                    </div>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center mt-20 mb-10">Recent registered Users</h1>
            <div className='text-white'>
                <ThemeProvider theme={theme}>
                    <LineChart 
                        xAxis={[{ scaleType: 'point', data: dates, label: "Date", labelStyle: { fill: '#fff', fontSize: 14, fontWeight: 'bold' },  tickLabelStyle: { fill: '#fff' }, axisLine: { stroke : "#fff", strokeWidth: 2 }}]}
                        yAxis={[{ label: 'Users', tickLabelStyle: { fill: '#fff', fontSize: 12 },labelStyle: { fill: '#fff', fontSize: 14, fontWeight: 'bold' },}]}
                        series={[{ data: counts,  curve: 'monotoneY', showMark: true, area: true, id: "userr" }]}
                        height={300}
                        colors={['#1ED760']}
                        sx={{ borderRadius: 5, marginLeft: 16, marginRight: 16,[`.${axisClasses.root}`]: {
                            [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                                stroke: '#fff',
                                strokeWidth: 2,
                            },
                            [`.${axisClasses.tickLabel}`]: {
                                fill: '#006BD6',
                            },
                            [`.${axisClasses.label}`]: {
                                fill: '#006BD6',
                            },
                            }, 
                        }} 
                    />
                </ThemeProvider>
            </div>
        </div>
    )
}
export default Dashboard




import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
    components: {
        MuiChartsLegend: {
            styleOverrides: {
                root: {
                color: '#000',
                fontSize: '14px',
                },
            },
        },
    },
});
