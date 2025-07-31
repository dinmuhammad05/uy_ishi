import { Schema, model } from "mongoose";

const CourseVideosSchema = new Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true, unique: true },
    courseId: { type: Schema.ObjectId, required: true },
},
    { timestamps: true, versionKey: false });

export default model("CourseVideos", CourseVideosSchema);