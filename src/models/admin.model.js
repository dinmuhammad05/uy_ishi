import { Schema, model } from "mongoose";

const AdminSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ["superAdmin", "admin"], default: "admin" },
  },
  { timestamps: true, versionKey: false }
);

export default model("Admin", AdminSchema);
