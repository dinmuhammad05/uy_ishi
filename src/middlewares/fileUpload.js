import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import multer from "multer";
import { v4 } from "uuid";

const uploadir = join(process.cwd(), "../uploads");
const VIDEO_MIME_TYPES = ["video/mp4", "video/mpeg", "video/quicktime"];

if (!existsSync(uploadir)) {
    mkdirSync(uploadir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
        let folder = ''
        if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
             folder = "videos";
        } else {
            return cb(new Error("yaroqsiz file turi"));
        }

        const uploadPath = join(uploadir, folder);

        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        const filename = `${v4()}_${file.originalname}`;
        cb(null, filename);
    },
});

export const uploadFile = multer({ storage });
