"use client"

import { apiClient } from '@/lib/api-client';
import { Video } from '@imagekit/next';
import { useEffect, useState } from 'react';
import { IVideo } from '@/Models/Video';
import { useSession } from 'next-auth/react';

const GetVideo =  () => {
  const [video, setVideo] = useState<IVideo[]>([]);
  const { data: session } = useSession();
  
  const allVideos = async()=>{
    try {
      const data = await apiClient.getVideos() as IVideo[];
      if(data.length > 0){
        const filteredVideos = data.filter((item)=> item.userId?.toString() !== session?.user?.id);
        setVideo(filteredVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    
  }
  useEffect(()=>{
    allVideos();
  },[]);
  
  if (!session) {
    return <div className="text-center h-screen font-bold md:text-4xl text-2xl flex items-center justify-center text-slate-700">Please login to view videos</div>;
  }

  if (!video || video?.length === 0) {
    return <div className="text-center h-screen font-bold text-4xl flex items-center justify-center">No videos available</div>;
  }
  return(
    <div className='md:px-85 px-3'>
    <h1 className='md:text-2xl text-xl font-bold md:py-4 py-2'>All Videos</h1>
    <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
      {
      video.map((item)=>{
        return (
          <div key={item._id?.toString()} className=' bg-slate-100 p-4 rounded-lg shadow-md'>
          <Video
            src={item?.videoUrl}
            width={640}
            height={360}
            controls
            className="rounded-lg shadow-lg"
          />
          <h2 className="md:text-xl text-lg font-semibold mt-4">{item.title}</h2>
          <p className="text-gray-600 md:mt-2 mt-1 md:text-lg text-sm">{item.description}</p>
        </div>
        )
      })
    }
    </div>
    </div>
  )
}

export default GetVideo