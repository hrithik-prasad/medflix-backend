const router = require('express').Router();
const pug = require('pug');
const pdf = require('html-pdf');
const path = require('path');
const puppeteer = require('puppeteer');
const { ROOT } = require('../../config');

// router.get('/pdf', (req, res, next) => {
//     const pdfCompiled = pug.compileFile(path.join(ROOT, 'views/index.pug'));
//     const compiledContent = pdfCompiled({ data });
//     console.log('compiled', compiledContent);
//     const filepath = path.join(ROOT, `public/pdfs/hello.pdf`);
//     pdf.create(compiledContent).toFile(filepath, (err, res) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(res);
//         }
//     });

//     res.json({ message: 'Wpr' });
// });

router.get('/downloadpdf', async (req, res) => {
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
    try {
        const pdfCompiled = pug.compileFile(path.join(ROOT, 'views/index.pug'));
        const compiledContent = pdfCompiled({ data });
        console.log('compiled', compiledContent);
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
