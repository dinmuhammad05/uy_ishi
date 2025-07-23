import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    ownerId: { type: Schema.ObjectId, required: true },
    categoryId: { type: Schema.ObjectId, required: true },
},
    { timestamps: true, versionKey: false });

export default model("Course", CourseSchema);
