import multer from "multer";
export function getProfileUpateMethod() {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage,
    });
    return upload
}