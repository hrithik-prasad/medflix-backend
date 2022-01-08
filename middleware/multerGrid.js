const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { MONGO_URI } = require('../config');
const storage = new GridFsStorage({
    url: MONGO_URI,
    file: (req, file) => {
        console.log('Multer', file);
        return new Promise((resolve, reject) => {
            const fileInfo = {
                filename: 'hello.pdf',
                bucketName: 'uploads',
            };
            resolve(fileInfo);
        });
    },
});

const upload = multer({
    storage,
});

module.exports = upload;
