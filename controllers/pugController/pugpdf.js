const router = require('express').Router();
const pug = require('pug');
const pdf = require('html-pdf');
const path = require('path');
const { ROOT } = require('../../config');
const mongoose = require('mongoose');
var Grid = require('gridfs-stream');
const fs = require('fs');
const upload = require('../../middleware/multerGrid');

const conn = mongoose.connection;
let bucket;

const datapath = path.join(__dirname, '/pdfs/hello.pdf');
conn.once('open', () => {
    console.log('connections is opened ');
    console.log(conn.db + 'wahab this is running');
    bucket = Grid(conn.db, mongoose.mongo);
});

function savePdf() {
    const id = new mongoose.mongo.ObjectId();
    let options = {
        _id: id,
        filename: 'hello.pdf',
        mode: 'w',
        chunkSize: 1024,
        root: 'my_collection',
    };
    var filestream = bucket.createWriteStream(options);
    fs.createReadStream(datapath).pipe(filestream);
    filestream.on('close', (file) => {
        console.log(file.filename + ' Write to DB');
    });
}

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
            state: 'Tamil nadu',
            country: 'India',
        },
        invoiceNumber: 12332523,
        dateofissue: '12/10/2020',
        invoiceTotal: 47.2,
        tax: 7.2,
        subtotal: 40,
        amountDue: 47.2,
    };

    const pdfCompiled = pug.compileFile(path.join(ROOT, 'views/index.pug'));
    const compiledContent = pdfCompiled({ payload });
    console.log('compiled', compiledContent);
    const filepath = path.join(__dirname, `pdfs/hello.pdf`);
    pdf.create(compiledContent).toFile(filepath, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
            savePdf();
            // upload.single(filepath);
        }
    });

    // res.json({ message: 'Wpr' });
});

router.get('/p', function (req, res) {
    res.render('index', { title: 'Invoice', payload });
});
module.exports = router;
