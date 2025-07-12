import { IVideo } from "@/Models/Video";

export type videoFormData = Omit<IVideo, "_id">

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

class ApiClient {
  private async fetch<T>(
    endPoint: string,
    options: FetchOptions = {}
  ): Promise<T>{
    const {method= "GET", body, headers={}} = options;

    const defaultHeaders = {
      "Content-Type":"application/json",
      ...headers
    }

    const response = await fetch(`/api${endPoint}`, {
      method,
      headers:defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    return response.json()
  }

  async getVideos(){
    return this.fetch("/auth/video");
  }

  async createVideo(videoData: videoFormData){
    return this.fetch("/auth/video",{
      method:"POST",
      body: videoData,
    })
  }
}

export const apiClient = new ApiClient();