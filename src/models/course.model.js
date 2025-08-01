import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
    title: { type: String},
    description: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    owner: { type: Schema.ObjectId, ref:'OwnerCourse'  },
    category: { type: Schema.ObjectId, ref: 'Category' },
},
    { timestamps: true, versionKey: false });

export default model("Course", CourseSchema);
