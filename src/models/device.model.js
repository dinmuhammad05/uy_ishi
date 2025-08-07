import { Schema } from "mongoose";

export const DeviceSchema = new Schema({
    deviceId: { type: String, required: true, unique: true },
    deviceType: { type: String },
    osName: { type: String },
    clientType: { type: String },
    clientName: { type: String },
});
