import mongoose from 'mongoose';

let isConnected = false
export async function connectToDatabase() {
    mongoose.set("strictQuery", true)

    if (isConnected) {
        return
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL!, { dbName: "devflow" })
        isConnected = true
        console.log("Mongodb connected")
    } catch (error) {
        isConnected = false
        console.log(error)
    }
}