import { Schema, model } from "mongoose";

const ClientSchema = new Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    wallet: { type: String, required: true, unique: true },
},
    { timestamps: true, versionKey: false });

export default model("Client", ClientSchema);
