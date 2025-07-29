import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String },
},
    {
        timestamps: true,
        versionKey: false,
        virtuals: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

CategorySchema.virtual('Course', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'category'
});

export default model("Category", CategorySchema);
