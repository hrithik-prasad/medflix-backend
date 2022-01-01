const makePdf = require('../controllers/pdfController/engine/pdfEngine');
const presTemplate = require('../controllers/pdfController/template/prescription');
const { find_doc } = require('../databaseQueries/doctorQueries');
const { find_pt } = require('../databaseQueries/patient');
const {
    createReport,
    findReport,
} = require('../databaseQueries/reportQueries');
const { find_users } = require('../databaseQueries/user');

const router = require('express').Router();

router.get('/getpdf/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Body', req.body);
    if (!id) return res.status(400).send({ message: 'query not complete' });
    try {
        // const patient = await find_pt(id);
        const report = await findReport(id);
        console.log('Report', { report });
        if (report.code !== 200) {
            res.status(400).send(
                report?.data || { message: 'Something went Wrong' }
            );
            return;
        }
        const patient = await find_pt(report.data.pt_id);
        if (patient.code !== 200) {
            res.status(400).send(
                patient?.data || { message: 'Finding patient went Wrong' }
            );
            return;
        }
        const doc = await find_doc(report.data.docId);
        if (doc.code !== 200) {
            res.status(400).send(
                doc?.data || { message: 'finding doc went Wrong' }
            );
            return;
        }
        const org = await find_users({ _id: report.data.pt_at });
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
                    advice: report.data.reportData.medAdvice,
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

router.post('/save/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log({ id });
        console.log(req.body);
        const { profileData, medAdvice } = req.body;

        if (!(profileData && medAdvice))
            return res.status(400).send({ message: 'Bad Request' });

        const patient = await find_pt(id);
        console.log('Patient', { patient });
        if (patient.code !== 200)
            return res.status(403).send({ message: 'patient id is invalid' });
        const org = await find_users({ _id: patient.data.pt_at });
        console.log('ORG:', { org });
        if (org.code !== 200) {
            return res.status(401).send({ message: 'pt at id  is invalid' });
        }
        const doc = await find_doc(patient.data.docId);
        console.log('Doc', { doc });
        if (doc.code != 200)
            return res.status(401).send({ message: 'Docit is invalid' });

        const report = await createReport({
            pt_id: id,
            reportData: { ...profileData, medAdvice },
            reportType: 'PRESCRIPTION',
            pt_at: org.data._id,
            docId: doc.data._id,
        });
        if (report.code !== 200) {
            return res.status(401).send({ message: 'Couldnt make report' });
        }
        res.send(report.data);
    } catch (err) {
        console.log('Save Pt data for report errror', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
});

module.exports = router;
