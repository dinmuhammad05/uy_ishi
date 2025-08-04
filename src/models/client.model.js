import { Schema, model } from "mongoose";

const ClientSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        hashedPassword: { type: String, required: true },
        image: {type: String},
        isActive: { type: Boolean, default: true },
        wallet: { type: Number, default: 0 },
        role: { type: String, default: "client" },
    },
    { timestamps: true, versionKey: false, toObject:{virtuals:true}, toJSON:{virtuals:true} }
);

ClientSchema.virtual("orders", {
    ref: "Order",
    localField: "_id",
    foreignField: "clientId",
});

export default model("Client", ClientSchema);
