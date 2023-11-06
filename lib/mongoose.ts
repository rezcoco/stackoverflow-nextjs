import mongoose from 'mongoose';

let isConnected = false
export async function connectToDatabase() {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        return console.log("Mongodb already connected")
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL!, { dbName: "devflow" })
        isConnected = true
    } catch (error) {
        isConnected = false
        console.log(error)
    }
}