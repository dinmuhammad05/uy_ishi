import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String },
},
    { timestamps: true, versionKey: false });

export default model("Category", CategorySchema);
