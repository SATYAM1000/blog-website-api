import mongoose from "mongoose";

const connectToDatabase = async (DATABASE_URL) => {
    try {
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connection successful...");
    } catch (error) {
        console.error("Database connection failed", error);
    }
}

export default connectToDatabase;
