import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
    try {
      const authenticationParameter = getUploadAuthParams({
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
      })
  
      return Response.json({ authenticationParameter, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })
    } catch (error) {
      console.log(error);
      return Response.json({
        error:"failed to authenticate by ImageKit"
      }, { status: 500 })
    }
}