import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
  throw new Error("Please define the mongodb url");
}

let cached = global.mongoose;

if(!cached){
  cached = global.mongoose = {conn: null, promise:null};
}

export async function dbConnect(){
  
    if(cached.conn){
      return cached.conn;
    }
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    }
    if(!cached.promise){
      mongoose.connect(MONGODB_URI, opts ).then(()=> mongoose.connection)
    }
    try {
      cached.conn = await cached.promise;
    } catch (error) {
      console.error("Failed to connect to the database", error);
      cached.promise = null; // Reset the promise on failure
      throw new Error("Failed to connect to the database");
    }

  return cached.conn;
}

