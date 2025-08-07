import DeviceDetector from "node-device-detector";
import CryptoJS from "crypto-js";
import config from "../config/index.js";

const devicedetector = new DeviceDetector();

class DeviceInfo {
    encrypt(userAgent) {
        const device = devicedetector.detect(userAgent);

        const info = {
            deviceId: "",
            osName: device.os.name ?? "",
            clientType: device.client.type ?? "",
            clientName: device.client.name ?? "",
            deviceType: device.device.type ?? "",
        };

        const signature = `${info.osName}-${info.clientType}-${
            info.clientName
        }-${info.deviceType}-${Date.now()}`;

        const deviceId = CryptoJS.AES.encrypt(
            signature,
            config.Device.SECRET_KEY
        ).toString();

        info.deviceId = deviceId;
        return info;
    }

    decrypt(deviceId) {
        const decrypt = CryptoJS.AES.decrypt(
            deviceId,
            config.Device.SECRET_KEY
        );

        const data = decrypt.toString(CryptoJS.enc.Utf8);

        return data;
    }
}

export default new DeviceInfo();