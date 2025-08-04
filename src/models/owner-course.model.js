import { Schema, model } from "mongoose";

const OwnerCourseSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        hashedPassword: { type: String, required: true },
        wallet: { type: Number, default:0 },
        experience: { type: String },
        image: {type: String},
        role: {type: String, enum: ['owner'], default: 'owner'}
    },
    {
        timestamps: true,
        versionKey: false,
        virtuals: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

OwnerCourseSchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "owner",
});

export default model("OwnerCourse", OwnerCourseSchema);
