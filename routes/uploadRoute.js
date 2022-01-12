const mongoose = require('mongoose');
const { BACKEND_URL } = require('../config');
const { createReport } = require('../databaseQueries/reportQueries');
const upload = require('../middleware/multerGrid');

const connection = mongoose.connection;
let gfs;
connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'uploads',
    });
});
const router = require('express').Router();

function getFile(filter) {
    return new Promise((resolve, reject) => {
        gfs.find(filter).toArray((err, files) => {
            if (!files || files.length === 0 || err) {
                reject({ code: 501, data: 'unable to find the file' });
            }
            resolve({ code: 200, data: files });
        });
    });
}

router.post('/image', upload.single('image'), (req, res) => {
    console.log('Req', req);
    console.log('File', req.file);
    cconsole.log('Files', req.files);
    res.send({ message: 'Hello' });
});

router.post(
    '/images',
    upload.fields([
        { name: 'lear', maxCount: 1 },
        { name: 'rear', maxCount: 1 },
        { name: 'lnose', maxCount: 1 },
        { name: 'rnose', maxCount: 1 },
        { name: 'tonsil', maxCount: 1 },
    ]),
    async (req, res) => {
        console.log('req', req.files);
        console.log('req BOdy', req.body);
        const { lear, rear, lnose, rnose, tonsil } = req.files;
        const {
            name,
            pt_id,
            patientId,
            orgId,
            orgName,
            docId,
            docName,
            learImp,
            rearImp,
            lnoseImp,
            rnoseImp,
            tonsilImp,
        } = req.body;

        const reportDataToSave = {
            patient: {
                id: patientId,
                name,
                pt_id,
            },
            org: {
                id: orgId,
                name: orgName,
            },
            doctor: {
                id: docId,
                name: docName,
            },
            reportType: 'ENDO',
            reportData: [],
        };
        if (lear) {
            reportDataToSave.reportData.push({
                imp: learImp.split(','),
                for: 'Left Ear',
                image: BACKEND_URL + '/upload/getImage/' + lear[0].filename,
            });
        }
        if (rear) {
            reportDataToSave.reportData.push({
                imp: rearImp.split(','),
                for: 'Right Ear',
                image: BACKEND_URL + '/upload/getImage/' + rear[0].filename,
            });
        }
        if (lnose) {
            reportDataToSave.reportData.push({
                imp: lnoseImp.split(','),
                for: 'Left Nose',
                image: BACKEND_URL + '/upload/getImage/' + lnose[0].filename,
            });
        }
        if (rnose) {
            reportDataToSave.reportData.push({
                imp: rnoseImp.split(','),
                for: 'Right Nose',
                image: BACKEND_URL + '/upload/getImage/' + rnose[0].filename,
            });
        }
        if (tonsil) {
            reportDataToSave.reportData.push({
                imp: tonsilImp.split(','),
                for: 'Throat',
                image: BACKEND_URL + '/upload/getImage/' + tonsil[0].filename,
            });
        }
        try {
            const reportFinal = await createReport(reportDataToSave);
            if (reportFinal.code !== 200) {
                return res
                    .status(500)
                    .send({ message: 'Count Not Save Report', reportFinal });
            }
            res.send(reportFinal.data);
        } catch (err) {
            console.log("Couldn't Make report", err);
            res.status(500).send({
                message: 'Count Not Save Report',
                err,
            });
        }
    }
);

router.get('/getImage/:fileName', async (req, res) => {
    const { fileName: name } = req.params;
    try {
        const repo = await getFile({ filename: name });
        const readstream = gfs.openDownloadStreamByName(name);
        readstream.pipe(res);
        console.log('Report', repo);
        // res.send(repo);
    } catch (err) {
        console.log('error on finding', err);
        res.send({ message: 'Done' });
    }
});
module.exports = router;
