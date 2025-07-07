const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log("MongoDB connecting error:", err))
}

module.exports = connectDB