"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loading from '../components/Loading';
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import {upload,} from "@imagekit/next"; 
import { Progress } from '@/components/ui/progress'
import { apiClient } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import mongoose from "mongoose";
import { IVideo } from '@/Models/Video'

export type createVideoResponse = {
  newVideo: IVideo
} | { error: string }


const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 100 * 1024 * 1024, {
      message: "File size must be less than 100MB",
    })
    .refine((file) => file.type.startsWith("video/"), {
      message: "File must be a video",
    }),
})

const VideoUploadForm = () => {

   const [loading, setLoading] = useState(false);
   const [uploading, setUploading] = useState(false);
   const [uploadingPercent, setUploadingPercent] = useState(0);
   const [error, setError] = useState<string | null>(null);
   const [uploadedFile, setUploadedFile] = useState<{url: string | null, thumbnail: string | null} | null>(null);
   const router = useRouter();
   const {data: session} = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        description: "",
        file: null as unknown as File, // Initialize with a dummy value
      },
    });

  

  const handleFileChange = async (file:File)=>{
      if(!file)return;
      setUploading(true);
      setError(null);

      try {
        const authRes = await fetch("/api/auth/imagekit-auth");
        const auth = await authRes.json();

    const data =   await upload({
          // Authentication parameters
                file,
                fileName: file.name, // Optionally set a custom file name
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                expire: auth?.authenticationParameter?.expire,
                token: auth?.authenticationParameter?.token,
                signature: auth?.authenticationParameter?.signature,
                onProgress: (event) => {
                    if(event.lengthComputable){
                      const percent = (event.loaded / event.total) * 100;
                      setUploadingPercent(Math.round(percent));}
                },
        })
        setUploadedFile({
          url: data.url || null,
          thumbnail: data.thumbnailUrl || null,
        });
        
      } catch (error) {
        console.error("Upload failed:", error);
      }finally{
        setUploading(false);
      }
    }

  async function onSubmit(value: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const data: createVideoResponse = await apiClient.createVideo({
        title: value.title,
        description: value.description,
        videoUrl: uploadedFile?.url || "",
        thumbnailUrl: uploadedFile?.thumbnail || "no thumbnail",
        userId: new mongoose.Types.ObjectId(session?.user?.id) || "",
      });
      if(!data) {
        setError("Failed to upload video. Please try again.");
        return;
      }
      if("error" in data){
        setError(data.error);
        return;
      }else{
        console.log("Video uploaded successfully:", data);
        form.reset();
        setUploadedFile(null);
        setUploadingPercent(0);
        router.push("/");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setError("Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
    
  }


  return (
     <div className=' w-full flex items-center justify-center '>
      <div className='bg-gray-200 md:p-5 p-4 rounded-lg shadow-lg md:w-[30%] w-[90%]'>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className='text-red-500 text-center bg-red-100 py-1 rounded-md'>{error}</p>}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field}  className='border border-gray-400' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea  {...field} className='border border-gray-400' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl className='p-0 m-0'>
                <Input
                  type='file'
                  onChange={(e)=>{
                  const file = e.target.files?.[0];
                  if(file){
                    field.onChange(file);
                    handleFileChange(file)
                  }
                  else field.onChange(undefined);
                  }}
                  className='border border-gray-400 file:bg-gray-300 file:cursor-pointer file:h-full file:px-2' />
              </FormControl>
              {uploading && (<Progress value={uploadingPercent}/>)}
              {uploading && <p className='text-blue-500'>Uploading...</p>}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={uploadingPercent < 100} type="submit" className='w-full cursor-pointer'>{loading ? <Loading/> : "Upload New reels"}</Button>
      </form>
     </Form>
      </div>
    </div>
  )
}

export default VideoUploadForm