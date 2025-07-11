import { dbConnect } from "@/lib/db";
import { NextRequest,NextResponse } from "next/server";
import User from "@/Models/User";

export async function POST(request: NextRequest){
  try {
    const {email, password} = await request.json();
    if(!email || !password){
      return NextResponse.json({error: "Email and password are required"}, {status: 400});
    }
    await dbConnect();
    const existingUser = await User.findOne({ email});
    if(existingUser){
      return NextResponse.json({error: "User already exists"}, {status: 400});
    }

    const newUser = await User.create({email, password});
    return NextResponse.json({message: "User created successfully", user: newUser}, {status: 201});
  } catch (error) {
    console.error("Error connecting to the database or processing request:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}