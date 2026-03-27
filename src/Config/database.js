import mongoose from "mongoose";
import config from '../Config/config.js'

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log(`Initial MongoDB connection successful...`)
    } catch (error) {
        console.log(`Initial MongoDB connection failed:`, error.message);
        process.exit(1)
    }

}

// Connection Events (runtime monitoring)
mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});
mongoose.connection.on("error", (err) => {
    console.log("MongoDB connnection error", err.message);
});
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

export default connectDB;