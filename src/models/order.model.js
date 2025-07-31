import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
    {
        clientId: { type: Schema.ObjectId, required: true },
        courseId: { type: Schema.ObjectId, required: true },
        status: {
            type: String,
            enum: ["in process", "completed", "canseled"],
            default: "in process",
        },
    },
    { timestamps: true, versionKey: false }
);

export default model("Order", OrderSchema);
