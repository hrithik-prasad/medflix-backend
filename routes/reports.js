const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-Italic.ttf',
    },
};

const presTemplate = require('../controllers/pdfController/template/prescription');
const { find_doc } = require('../databaseQueries/doctorQueries');
const { find_pt } = require('../databaseQueries/patient');
const {
    createReport,
    findReport,
} = require('../databaseQueries/reportQueries');
const { find_users } = require('../databaseQueries/user');
const { handleJWT } = require('../middleware/handleJWT');

const router = require('express').Router();

router.get('/getpdf/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Body', req.body);
    if (!id) return res.status(400).send({ message: 'query not complete' });
    try {
        // console.log('ID:', id);
        const report = await findReport({ _id: id });
        // console.log('Report', { report });
        if (report.code !== 200) {
            res.status(400).send(
                report?.data || { message: 'Something went Wrong' }
            );
            return;
        }
        const patient = await find_pt(report.data[0].pt_id);
        if (patient.code !== 200) {
            res.status(400).send(
                patient?.data || { message: 'Finding patient went Wrong' }
            );
            return;
        }
        const doc = await find_doc(report.data[0].docId);
        if (doc.code !== 200) {
            res.status(400).send(
                doc?.data || { message: 'finding doc went Wrong' }
            );
            return;
        }
        const org = await find_users({ _id: report.data[0].pt_at });
        if (org.code !== 200) {
            res.status(400).send(
                org?.data || { message: 'finding user went Wrong' }
            );
            return;
        }

        pdfMake
            .createPdf(
                presTemplate({
                    docName: doc.data.name,
                    specialization: doc.data.specialization,
                    detailsArray: [
                        'Fromer Senior Resident',
                        'Aiims, Patna',
                        'Life Member of IMA',
                    ],
                    orgName: org.data.full_name,
                    subHeader: 'ENT & Maternity Center',
                    website: 'aakritihostpital.com',
                    loc: 'Near Sanichara Mandir, Sandalpur Road,Kumhrar, Patna: 800006',
                    contact: 'MobileNumber: 7070996106, 7070996103, 7070996104',
                    ptDetails: {
                        name: patient.data.name,
                        ageSex: `${patient.data.age}/${patient.data.gender}`,
                        address: patient.data.address,
                        mobile_number: patient.data.mobile_number,
                    },
                    date: new Date(),
                    advice: report.data[0].reportData.medAdvice,
                    complaints: report.data[0].reportData.comp,
                    diagnosis: report.data[0].reportData.diagnosis,
                })
            )
            .getBase64((data) => {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Dispositon': 'attachment;filename="filename.pdf"',
                });
                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download);
            });
    } catch (err) {
        console.log(err);
        res.send({ message: 'error' });
    }
});

router.get('/list', handleJWT, async (req, res) => {
    try {
        const { user_id } = req;
        if (!user_id)
            return res.status(400).send({ message: 'Something Went Wrong' });
        const reports = await findReport({ 'org.id': user_id });
        // const patient = await find_pt(reports.data[0].pt_id);
        // console.log('patient', patient);
        //TODO: change db model add name basic field in all model
        res.send(reports);
    } catch (err) {
        console.log('Error', err);
        res.status(400).send({ message: 'Something Went Wrong' });
    }
});

router.get('/pt/:id', handleJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const reports = await findReport({
            'patient.id': id,
            pt_at: req.user_id,
        });
        if (reports.code !== 200 && reports.code !== 206) {
            return res
                .status(500)
                .send({ message: 'Reports not Found', reports });
        }
        res.send(reports.data);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Reports not Found', error });
    }
});

router.post('/save/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { profileData, medAdvice } = req.body;
        if (!(profileData && medAdvice))
            return res.status(400).send({ message: 'Bad Request' });
        const patient = await find_pt(id);
        // console.log('Patient', { patient });
        if (patient.code !== 200)
            return res.status(403).send({ message: 'patient id is invalid' });
        const org = await find_users({ _id: patient.data.pt_at.id });
        // console.log('ORG:', { org });
        if (org.code !== 200) {
            return res.status(401).send({ message: 'pt at id  is invalid' });
        }
        const doc = await find_doc(patient.data.doctor.id);
        // console.log('Doc', { doc });
        if (doc.code != 200)
            return res.status(401).send({ message: 'Docit is invalid' });

        const report = await createReport({
            patient: {
                id,
                name: patient.data.name,
                pt_id: patient.data.pt_id,
            },
            reportData: { ...profileData, medAdvice },
            reportType: 'PRESCRIPTION',
            org: {
                id: org.data._id,
                name: org.data.name,
            },
            doctor: {
                id: doc.data._id,
                name: doc.data.name,
            },
        });
        if (report.code !== 200) {
            return res.status(401).send({ message: 'Couldnt make report' });
        }
        // console.log('report', report);
        res.send(report);
    } catch (err) {
        console.log('Save Pt data for report errror', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
});

module.exports = router;
