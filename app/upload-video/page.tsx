
import React from 'react'
import VideoUploadForm from '../components/VideoUploadForm'

const VidoeUploadPage = () => {
  return (
    <div className='flex flex-col items-center justify-center md:min-h-screen min-h-fit w-full'>
      <h1 className='md:text-2xl text-md font-bold text-center my-4'>Upload Your Video</h1>
      <VideoUploadForm/>
    </div>
  )
}

export default VidoeUploadPage
