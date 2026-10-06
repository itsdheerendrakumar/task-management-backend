import multer from "multer";
export function parseMessagePayload() {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 3 * 1024 * 1024,
        }
    });
    return upload
}