const presTemplate = require('../template/prescription');
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

const makePdf = () => {
    const template = presTemplate();
    // console.log('direct', presTemplate());
    console.log('Template at makepdf', template);
    return pdfMake.createPdf(presTemplate()).getBase64((data) => {
        // res.writeHead(200, {
        //     'Content-Type': 'application/pdf',
        //     'Content-Dispositon': 'attachment;filename="filename.pdf"',
        // });
        // console.log('data', data);
        return Buffer.from(data.toString('utf-8'), 'base64');
    });
};

module.exports = makePdf;
