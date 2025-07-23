import { Schema, model } from "mongoose";

const OwnerCourseSchema = new Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    hashedPassword: { type: String, required: true },
    wallet: { type: String, required: true, unique: true },
    experience: { type: String },
},
    { timestamps: true, versionKey: false });

export default model("OwnerCourse", OwnerCourseSchema);
