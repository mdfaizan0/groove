import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedAudioTypes = ["audio/mpeg", "audio/wav"];
    const allowedImageTypes = ["image/jpeg", "image/png"];

    if (file.fieldname === "audioFile") {
        if (allowedAudioTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid audio file type. Only MP3 and WAV are allowed."), false);
        }
    } else if (file.fieldname === "coverImage") {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid image file type. Only JPEG and PNG are allowed."), false);
        }
    } else {
        cb(new Error("Unexpected field"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit for now, adjust as needed
    }
});

export const uploadTrackFiles = upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]);

export const uploadPodcastCover = upload.single("coverImage");

export const uploadPodcastAudio = upload.single("audioFile");
