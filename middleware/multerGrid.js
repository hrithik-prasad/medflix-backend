const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { MONGO_URI } = require('../config');
const storage = new GridFsStorage({
    url: MONGO_URI,
    file: (req, file) => {
        console.log('Multer', file);
        return new Promise((resolve, reject) => {
            const fileInfo = {
                filename: `file_${Date.now()}`,
                bucketName: 'uploads',
            };
            req.file_name = fileInfo.filename;
            resolve(fileInfo);
        });
    },
});

const upload = multer({
    storage,
});

module.exports = upload;
