import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import multer from 'multer'
import { v4 } from 'uuid'

const uploadir = join(process.cwd(), '../uploads');

if (!existsSync(uploadir)) {
    mkdirSync(uploadir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadir)
    },
    filename: function (_req, file, cb) {
        const filename = `${v4()}_${file.originalname}`;
        cb(null, filename)
    }
});

export const uploadFile = multer({ storage })