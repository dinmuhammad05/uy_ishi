import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: Schema.ObjectId, ref:'OwnerCourse'  },
    category: { type: Schema.ObjectId, ref: 'Category' },
},
    { timestamps: true, versionKey: false });

export default model("Course", CourseSchema);
