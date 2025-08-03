import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
    {
        clientId: { type: Schema.ObjectId, ref:'Client', required: true },
        courseId: { type: Schema.ObjectId, ref:'Course', required: true },
        status: {
            type: String,
            enum: ["in process", "completed", "canseled"],
            default: "in process",
        },
    },
    { timestamps: true, versionKey: false }
);

export default model("Order", OrderSchema);
