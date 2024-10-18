import mongoose from "mongoose";
import { MONGO_URL } from "../constants/env";

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to database")
    } catch(e) {
        console.log('Error connecting to database: ', e)
        process.exit(1)
    }
}

export default connectToMongoDb;