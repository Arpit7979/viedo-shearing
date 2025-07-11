import mongoose from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920
} as const

export interface IVideo {
  userId: mongoose.Types.ObjectId;
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  control?: boolean;
  transformation?:{
    width: number;
    height: number;
    quality?: number;
  }
}

const videoSchema = new mongoose.Schema<IVideo>({
  title:{
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  videoUrl:{
    type: String,
    required: true,
  },
  thumbnailUrl:{
    type: String,
    required: true,
  },
  control:{
    type: Boolean,
    default: true,
  },
  transformation:{
    width: {
      type: Number,
      default: VIDEO_DIMENSIONS.width,
    },
    height: {
      type: Number,
      default: VIDEO_DIMENSIONS.height,
    },
    quality: {
      type: Number,
      min:1,
      max: 100,
    },
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  }
},{timestamps: true});

const Video = mongoose.models?.Video || mongoose.model<IVideo>("Video", videoSchema);

export default Video;