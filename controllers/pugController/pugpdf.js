const router = require('express').Router();
const pug = require('pug');
const pdf = require('html-pdf');
const path = require('path');
const { ROOT } = require('../../config');
// const mongoose = require('mongoose');
// var Grid = require('gridfs-stream');
// const fs = require('fs');
// const upload = require('../../middleware/multerGrid');

// const conn = mongoose.connection;
// let bucket;

// const datapath = path.join(__dirname, '/pdfs/hello.pdf');
// conn.once('open', () => {
//     console.log('connections is opened ');
//     console.log(conn.db + 'wahab this is running');
//     bucket = Grid(conn.db, mongoose.mongo);
// });

// function savePdf() {
//     const id = new mongoose.mongo.ObjectId();
//     let options = {
//         _id: id,
//         filename: 'hello.pdf',
//         mode: 'w',
//         chunkSize: 1024,
//         root: 'my_collection',
//     };
//     var filestream = bucket.createWriteStream(options);
//     fs.createReadStream(datapath).pipe(filestream);
//     filestream.on('close', (file) => {
//         console.log(file.filename + ' Write to DB');
//     });
// }

router.get('/pdf', (req, res, next) => {
    const payload = {
        items: [
            {
                name: 'paste',
                cost: 40,
                quantity: 1,
                amount: 40,
            },
        ],
        customerDetails: {
            name: 'Muthu',
            area: '8/91, main street',
            city: 'chennai',
            state: 'https://aakritihospital.netlify.app/static/media/logo.e50a3e57.jpeg',
            country: 'India',
            logo: 'https://aakritihospital.netlify.app/static/media/logo.e50a3e57.jpeg',
        },
        invoiceNumber: 12332523,
        dateofissue: '12/10/2020',
        invoiceTotal: 47.2,
        tax: 7.2,
        subtotal: 40,
        amountDue: 47.2,
    };
    const data = {
        doc: {
            docName: 'Dr Archana Singh ',
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

    const pdfCompiled = pug.compileFile(path.join(ROOT, 'views/index.pug'));
    const compiledContent = pdfCompiled({ data });
    console.log('compiled', compiledContent);
    const filepath = path.join(ROOT, `public/pdfs/hello.pdf`);
    pdf.create(compiledContent).toFile(filepath, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });

    res.json({ message: 'Wpr' });
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

    res.render('index', { title: 'Invoice', data });
});
module.exports = router;
