import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Video, { IVideo } from "@/Models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(){
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({createdAt: -1}).lean();
    if(!videos || videos.length === 0){
      return NextResponse.json([], {status:500});
    }
    return NextResponse.json(videos, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({error: "failed to fetch videos"}, {status: 500});
  }
}

export async function POST(request:NextRequest){
  try {
    //first only authenticated users can create videos
    const session = await getServerSession(authOptions);
    if(!session){
      return NextResponse.json({error: "unauthorized"}, {status: 401});
    }
    await dbConnect();
    const body: IVideo = await request.json();
    if(
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ){
      return NextResponse.json({error: "title, description, videoUrl and thumbnailUrl are required"}, {status: 400});
    }
    const videoOptions = {
      ...body,
      control: body?.control ?? true, //default value for control is true
      transformation:{
        width: 1080,
        height: 1920,
        quality: body?.transformation?.quality ?? 100,
      }
    }
    const newVideo: IVideo = await Video.create(videoOptions);

    return NextResponse.json(newVideo, {status: 201});
  } catch (error) {
    console.log(error);
    return NextResponse.json({error: "failed to create video"}, {status: 500});
    
  }
}