import { Schema, model } from "mongoose";

const ClientSchema = new Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    wallet: { type: Number, default:0 },
    role:{type: String, default:'client'}
},
    { timestamps: true, versionKey: false });

export default model("Client", ClientSchema);
