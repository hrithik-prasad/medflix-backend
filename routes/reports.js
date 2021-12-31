const makePdf = require('../controllers/pdfController/engine/pdfEngine');
const presTemplate = require('../controllers/pdfController/template/prescription');
const { find_pt } = require('../databaseQueries/patient');

const router = require('express').Router();

router.get('/make/:id', async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: 'query not complete' });
    try {
        const patient = await find_pt(id);
        console.log('patient found', patient);
        if (patient.code === 200) {
            // const template = makePdf();
            pdfMake.createPdf(presTemplate()).getBase64((data) => {
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Dispositon': 'attachment;filename="filename.pdf"',
                });

                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download);
            });
            // console.log('Template At router', template);
            // res.writeHead(200, {
            //     'Content-Type': 'application/pdf',
            //     'Content-Dispositon': 'attachment;filename="filename.pdf"',
            // });
            // return res.send(makePdf());
            // return res.send({ patient });
        } else {
            return res.status(401).send({ patient });
        }
    } catch (err) {
        console.log(err);
        res.send({ message: 'error' });
    }
});

module.exports = router;
