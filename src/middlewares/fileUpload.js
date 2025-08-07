import { join, extname } from "path";
import { existsSync, mkdirSync } from "fs";
import multer from "multer";
import { v4 } from "uuid";

const uploadir = join(process.cwd(), "../uploads");

const VIDEO_MIME_TYPES = ["video/mp4", "video/mpeg", "video/quicktime"];
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml", "image/x-icon", "image/avif"];

if (!existsSync(uploadir)) {
    mkdirSync(uploadir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
        let folder = "";

        if (VIDEO_MIME_TYPES.includes(file.mimetype)) {
            folder = "course-videos";
        } else if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
            folder = "images";
        } else {
            return cb(new Error("Yaroqsiz fayl turi"));
        }

        const uploadPath = join(uploadir, folder);

        if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
            
            
        }

        cb(null, uploadPath);
    },

    filename: function (_req, file, cb) {
        const filename = `${v4()}_${file.originalname}`;
        console.log(filename);
        
        cb(null, filename);
    },
});

export const uploadFile = multer({ storage });
