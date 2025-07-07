const express = require("express");
const http = require("http");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const authRoutes = require("./routes/User/authRoutes");
const otpRoutes = require('./routes/User/OtpRoutes');
const userRoutes = require("./routes/Admin/userRoute");
const songRoutes = require("./routes/Admin/songRoutes");
const artistRoutes = require("./routes/Admin/artistRoute");
const genreRoutes = require("./routes/Admin/genreRoute");
const searchRoutes = require("./routes/User/searchRoutes");
const withdrawRoutes = require("./routes/User/withdrawRoutes");
const couponRoutes = require("./routes/Admin/couponRoute");
const notificationRoutes = require("./routes/Admin/notificationRoute")
const likedSongsRoutes = require("./routes/User/likedSongsRoutes")
const { errorMiddleware } = require("./helper/errorMiddleware");
const verifyToken = require("./middleware/verifyToken");
const User = require("./models/User");
const Notification = require("./models/Notification")




const app = express()
const server = http.createServer(app)

const socketServer = require("./socketServer");
const { paymentGateway, confirmPayment } = require("./controllers/User/paymentController");
socketServer(server, app)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});


const route = express.Router()


connectDB()

app.use("/api/auth", authRoutes)
app.use('/api/otp', otpRoutes)

app.use('/api/auth', userRoutes)
app.use('/api/songs', songRoutes)
app.use('/api/artist', artistRoutes)
app.use('/api', genreRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/coupon', couponRoutes)
app.use('/api/referral', withdrawRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/create-checkout-session', paymentGateway)
app.use("/api/payment-confirm", confirmPayment);
app.use('/api/likedsongs', likedSongsRoutes)


route.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
        const { profileImage, name } = user
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
app.use('/api/auth', route);

app.use(errorMiddleware)


server.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
})