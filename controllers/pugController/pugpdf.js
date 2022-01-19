const router = require('express').Router();
// const pug = require('pug');
// const pdf = require('html-pdf');
// const path = require('path');
// const puppeteer = require('puppeteer');
// const { ROOT, BACKEND_URL } = require('../../config');
const { find_pt } = require('../../databaseQueries/patient');
const { findReport } = require('../../databaseQueries/reportQueries');
const { find_doc } = require('../../databaseQueries/doctorQueries');
const { find_users } = require('../../databaseQueries/user');

router.get('/preview/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: 'query not complete' });
        console.log('ID:', id);
        const report = await findReport({ _id: id });
        console.log('Report', report);
        if (report.code !== 200) {
            res.status(400).send(
                report?.data || { message: 'Something went Wrong' }
            );
            return;
        }
        const patient = await find_pt(report.data[0].patient.id);
        if (patient.code !== 200) {
            res.status(400).send(
                patient?.data || { message: 'Finding patient went Wrong' }
            );
            return;
        }
        const doc = await find_doc(report.data[0].doctor.id);
        if (doc.code !== 200) {
            res.status(400).send(
                doc?.data || { message: 'finding doc went Wrong' }
            );
            return;
        }
        const org = await find_users({ _id: report.data[0].org.id });
        if (org.code !== 200) {
            res.status(400).send(
                org?.data || { message: 'finding user went Wrong' }
            );
            return;
        }

        if (report.data[0].reportType === 'PRESCRIPTION') {
            console.log('Presctiption');
        } else if (report.data[0].reportType === 'ENDO') {
            console.log('ENDO');
            const tempDate = new Date();
            const endoData = {
                doc: {
                    name: doc.data.name,
                    degree: doc.data.specialization,
                    specs: doc.data.spec,
                    pos: doc.data.position,
                },
                org: {
                    name: org.data.name,
                    logo: org.data.logo,
                    subTitle: org.data.subTitle,
                    punchLine: org.data.punchLine,
                    website: org.data.website,
                    address: org.data.address,
                    contact: org.data.contact,
                },
                ptData: {
                    name: patient.data.name,
                    phone: patient.data.mobile_number,
                    id: patient.data.pt_id ?? 1,
                    address: patient.data.address,
                    date: tempDate.toDateString(),
                },
                meds: report.data[0].reportData,
            };
            return res.render('indo', { ...endoData });
        }
        const dateNow = new Date();
        const data = {
            doc: {
                name: doc.data.name,
                degree: doc.data.specialization,
                specs: doc.data.spec,
                pos: doc.data.position,
            },
            org: {
                name: org.data.name,
                logo: org.data.logo,
                subTitle: org.data.subTitle,
                punchLine: org.data.punchLine,
                website: org.data.website,
                address: org.data.address,
                contact: org.data.contact,
            },
            ptData: {
                name: patient.data.name,
                phone: patient.data.mobile_number,
                id: patient.data.pt_id ?? 1,
                address: patient.data.address,
                bp: report.data[0].reportData.bp,
                weight: report.data[0].reportData.weight,
                date: dateNow.toDateString(),
            },
            ptComplaints: {
                complaints: report.data[0].reportData.comp,
                oE: report.data[0].reportData.diagnosis,
                testsPrescribed:
                    report.data[0].reportData.testsPrescribed ?? '',
                OtherFindings: '',
            },
            meds: report.data[0].reportData.medAdvice,
        };

        res.render('index', { data });
    } catch (err) {
        res.send("sorry Couldn't Preview");
    }
});

// router.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!id) return res.status(400).send({ message: 'query not complete' });
//         console.log('ID:', id);
//         const report = await findReport({ _id: id });
//         console.log('Report', report);
//         if (report.code !== 200) {
//             res.status(400).send(
//                 report?.data || { message: 'Something went Wrong' }
//             );
//             return;
//         }
//         const patient = await find_pt(report.data[0].patient.id);
//         if (patient.code !== 200) {
//             res.status(400).send(
//                 patient?.data || { message: 'Finding patient went Wrong' }
//             );
//             return;
//         }
//         const doc = await find_doc(report.data[0].doctor.id);
//         if (doc.code !== 200) {
//             res.status(400).send(
//                 doc?.data || { message: 'finding doc went Wrong' }
//             );
//             return;
//         }
//         const org = await find_users({ _id: report.data[0].org.id });
//         if (org.code !== 200) {
//             res.status(400).send(
//                 org?.data || { message: 'finding user went Wrong' }
//             );
//             return;
//         }
//         const dateNow = new Date();

//         const data = {
//             doc: {
//                 name: doc.data.name,
//                 degree: doc.data.specialization,
//                 specs: doc.data.spec,
//                 pos: doc.data.position,
//             },
//             org: {
//                 name: org.data.name,
//                 logo: org.data.logo,
//                 subTitle: org.data.subTitle,
//                 punchLine: org.data.punchLine,
//                 website: org.data.website,
//                 address: org.data.address,
//                 contact: org.data.contact,
//             },
//             ptData: {
//                 name: patient.data.name,
//                 phone: patient.data.mobile_number,
//                 id: patient.data.pt_id ?? 1,
//                 address: patient.data.address,
//                 bp: report.data[0].reportData.bp,
//                 weight: report.data[0].reportData.weight,
//                 date: dateNow.toDateString(),
//             },
//             ptComplaints: {
//                 complaints: report.data[0].reportData.comp,
//                 oE: report.data[0].reportData.diagnosis,
//                 testsPrescribed:
//                     report.data[0].reportData.testsPrescribed ?? '',
//                 OtherFindings: '',
//             },
//             meds: report.data[0].reportData.medAdvice,
//         };

//         const pdfCompiled = pug.compileFile(path.join(ROOT, 'views/index.pug'));
//         const compiledContent = pdfCompiled({ data });
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox', '--disabled-setupid-sandbox'],
//         });
//         const convertPage = await browser.newPage();
//         await convertPage.setContent(compiledContent);
//         const pdfBuffer = await convertPage.pdf({
//             format: 'a4',
//             printBackground: true,
//         });
//         res.set('Content-Type', 'application/pdf');
//         res.status(201).send(Buffer.from(pdfBuffer, 'binary'));
//     } catch (err) {
//         console.log('Error on making pdf', err);
//         res.status(500).send({ message: 'Could not create pdf' });
//     }
// });

module.exports = router;
