const router = require('express').Router();
const pug = require('pug');
const pdf = require('html-pdf');
const path = require('path');
const puppeteer = require('puppeteer');
const { ROOT } = require('../../config');
const { find_pt } = require('../../databaseQueries/patient');
const { findReport } = require('../../databaseQueries/reportQueries');
const { find_doc } = require('../../databaseQueries/doctorQueries');
const { find_users } = require('../../databaseQueries/user');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: 'query not complete' });
        console.log('ID:', id);
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

        const data = {
            doc: {
                name: doc.data.name,
                degree: doc.data.specialization,
                specs: [
                    'Ex obs& gynae Registrar of vivekananad institure of medical sciecne(vims)',
                    ,
                    'life member of ima & gdsi',
                ],
                pos: 'consultant gyaneocologiest, infertility speciality',
            },
            org: {
                name: org.data.full_name,
                logo: 'https://aakritihospital.netlify.app/static/media/logo.e50a3e57.jpeg',
                subTitle: 'ENT & Maternity Hospital',
                punchLine: 'Reshape Your Health',
                website: 'www.aakritihospital.com',
                address:
                    'Near Sanichara Mandir, Sandalpur Road, Kumhrar, Patna -6',
                contact: 'Mobile: 7070996106, 7070996105, 7070996104',
            },
            ptData: {
                name: patient.data.name,
                phone: patient.data.mobile_number,
                id: patient.data._id ?? 1,
                address: patient.data.address,
                bp: '12',
                weight: '45',
                date: new Date(),
            },
            ptComplaints: {
                complaints: report.data.reportData.comp,
                oE: report.data.reportData.diagnosis,
                testsPrescribed: report.data.reportData.testsPrescribed ?? '',
                OtherFindings: '',
            },
            meds: report.data.reportData.medAdvice,
        };

        const pdfCompiled = pug.compileFile(path.join(ROOT, 'views/index.pug'));
        const compiledContent = pdfCompiled({ data });
        const browser = await puppeteer.launch({
            headless: true,
            // args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const convertPage = await browser.newPage();
        await convertPage.setContent(compiledContent);
        const pdfBuffer = await convertPage.pdf({
            format: 'a4',
            printBackground: true,
        });
        res.set('Content-Type', 'application/pdf');
        res.status(201).send(Buffer.from(pdfBuffer, 'binary'));
    } catch (err) {
        console.log('Error on making pdf', err);
        res.status(500).send({ message: 'Could not create pdf' });
    }
});

router.get('/p', function (req, res) {
    const data = {
        doc: {
            name: 'Dr Archana Singh ',
            degree: 'MBBS (HONS), MS obs & gynae',
            specs: [
                'Ex obs& gynae Registrar of vivekananad institure of medical sciecne(vims)',
                ,
                'life member of ima & gdsi',
            ],
            pos: 'consultant gyaneocologiest, infertility speciality',
        },
        org: {
            name: 'Aakriti Hospital',
            logo: 'https://aakritihospital.netlify.app/static/media/logo.e50a3e57.jpeg',
            subTitle: 'ENT & Maternity Hospital',
            punchLine: 'Reshape Your Health',
            website: 'www.aakritihospital.com',
            address: 'Near Sanichara Mandir, Sandalpur Road, Kumhrar, Patna -6',
            contact: 'Mobile: 7070996106, 7070996105, 7070996104',
        },
        ptData: {
            name: 'SomeOne',
            phone: '7070996051',
            id: '120',
            address: 'Patna',
            bp: '15',
            weight: '45',
            date: '2022/01/08',
        },
        ptComplaints: {
            complaints: 'Headache',
            oE: 'Viral',
            testsPrescribed: 'HOmo',
            OtherFindings: 'asdasda',
        },
        meds: [
            { name: 'Tab. Odimont lc', dosage: '1-0-0', duration: '10days' },
            { name: 'Tab. Odimont lc', dosage: '1-0-0', duration: '10days' },
            { name: 'Tab. Odimont lc', dosage: '1-0-0', duration: '10days' },
            { name: 'Tab. Odimont lc', dosage: '1-0-0', duration: '10days' },
        ],
    };

    res.render('index', { data });
});
module.exports = router;
