function presTemplate({
    docName,
    specialization,
    detailsArray,
    orgName,
    subHeader,
    website,
    loc,
    contact,
    ptDetails,
    date,
    advice,
    complaints,
    diagnosis,
}) {
    const logoImage =
        'data:image/png;base64,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';

    console.log(docName);
    console.log(specialization);
    console.log(detailsArray);
    console.log(orgName);
    console.log(subHeader);
    console.log(website);
    console.log(loc);
    console.log(contact);
    console.log(ptDetails);
    console.log(advice);

    const adviceBody = [
        [
            { text: 'Medicine', style: 'tableHeader' },
            { text: 'Dose', style: 'tableHeader' },
            { text: 'Freq', style: 'tableHeader' },
        ],
    ];

    advice.map((med) => {
        adviceBody.push([
            { text: med.med, style: 'tableData' },
            { text: med.dose, style: 'tableData' },
            { text: med.for, style: 'tableData' },
        ]);
    });

    console.log('Advice:', adviceBody);
    const dd = {
        pageSize: 'A4',
        footer: {
            text: [
                {
                    // text: 'Dr AmarNath Prasad\n',
                    text: docName + '\n',
                    alignment: 'right',
                    decoration: 'overline',
                },
                // 'EveryDay Morning: 09:00AM to 02:00PM and 06:00PM to 09:00PM Evening\n',
                // 'Sunday 09:00AM to 02:00PM\n',
                {
                    text: 'Not For Medico-Legal Purposes\n',
                    bold: true,
                    alignment: 'center',
                },
            ],
            margin: [0, 0, 30, 0],
            height: 100,
        },
        content: [
            {
                columns: [
                    {
                        text: [
                            {
                                // text: 'Dr.Amarnath Prasad\n',
                                text: docName + '\n',
                                style: 'docHeader',
                                width: 200,
                            },
                            {
                                // text: 'MBBS, MS(ENT)\n',
                                text: specialization + '\n',
                                fontSize: 12,
                                style: 'subHead',
                            },
                            {
                                text: detailsArray.map((detail) => {
                                    console.log('DetailsSepec: ', detail);
                                    return {
                                        text: detail + '\n',
                                        fontSize: 10,
                                        style: 'subHead',
                                    };
                                }),
                            },
                            // {
                            //     text: 'Fromer Senior Resident\n',
                            //     fontSize: 10,
                            //     style: 'subHead',
                            // },
                            // {
                            //     text: 'Aiims, Patna\n',
                            //     fontSize: 10,
                            //     style: 'subHead',
                            // },
                            // {
                            //     text: 'Life Member of IMA\n',
                            //     fontSize: 10,
                            //     style: 'subHead',
                            // },
                        ],
                    },
                    {
                        image: logoImage,
                        width: 100,
                        fit: [100, 100],
                        alignment: 'center',
                        height: 100,
                    },
                    // {
                    //     image: 'logo',
                    //     width: 100,
                    //     fit: [100, 100],
                    //     alignment: 'center',
                    //     height: 100,
                    // },

                    {
                        text: [
                            {
                                // text: 'Aakriti Hospital\n',
                                text: orgName + '\n',
                                style: 'docHeader',
                                width: 200,
                            },
                            {
                                // text: 'ENT & Maternity Center\n',
                                text: subHeader + '\n',
                                fontSize: 12,
                                style: 'subHead',
                            },
                            {
                                // text: 'www.aakritihospital.com\n',
                                text: website + '\n',
                                fontSize: 10,
                                style: 'subHead',
                            },
                            // {
                            //     text: 'Aiims, Patna\n',
                            //     fontSize: 10,
                            //     style: 'subHead',
                            // },
                            {
                                // text: 'Near Sanichara Mandir, Sandalpur Road, Kumhrar, Patna: 800006\n',
                                text: loc + '\n',
                                fontSize: 10,
                                style: 'subHead',
                            },
                            {
                                // text: 'MobileNumber: 7070996106, 7070996103, 7070996104\n',
                                text: contact + '\n',
                                fontSize: 10,
                                style: 'subHead',
                            },
                        ],
                    },
                ],
            },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        // ['Name: Hrithik Prasad', { text: '', noWrap: true }],
                        [
                            `Name: ${ptDetails.name}`,
                            {
                                text: `Date: ${date.toDateString()}`,
                                noWrap: true,
                            },
                        ],
                        [
                            // 'Age/Sex: 18Y/M',
                            `Age/Sex: ${ptDetails.ageSex}`,
                            // { text: 'Date: 2022/01/01', noWrap: true },
                            {
                                text: `MobileNumber: ${ptDetails.mobile_number}`,
                                noWrap: true,
                            },
                        ],
                        [
                            // 'Address: Patna, Sandalpur',
                            `Address: ${ptDetails.address}`,
                            { text: '#Visits: 1', noWrap: true },
                        ],
                        // [
                        //     // 'MobileNumber: 8969846714',
                        //     `MobileNumber: ${ptDetails.mobile_number}`,
                        //     { text: '', noWrap: true },
                        // ],
                    ],
                },
                layout: 'noBorders',
            },

            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        [
                            //   "Complaints: Archana pt",
                            complaints ? `Complaints: ${complaints}` : '',
                            {
                                // text: 'Date: Sat Jan 01 2022',
                                text: diagnosis
                                    ? `Diagnosis: ${diagnosis}`
                                    : '',
                                noWrap: true,
                            },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            { text: 'Rx:', alignment: 'left' },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', '*', '*'],
                    headerRows: 1,
                    // body: [
                    //     [
                    //         { text: 'Medicine', style: 'tableHeader' },
                    //         { text: 'Dose', style: 'tableHeader' },
                    //         { text: 'Freq', style: 'tableHeader' },
                    //     ],
                    //     [
                    //         { text: 'Header 1', style: 'tableData' },
                    //         { text: 'Header 2', style: 'tableData' },
                    //         { text: 'Header 3', style: 'tableData' },
                    //     ],
                    //     [
                    //         { text: 'Header 1', style: 'tableData' },
                    //         { text: 'Header 2', style: 'tableData' },
                    //         { text: 'Header 3', style: 'tableData' },
                    //     ],
                    //     [
                    //         { text: 'Header 1', style: 'tableData' },
                    //         { text: 'Header 2', style: 'tableData' },
                    //         { text: 'Header 3', style: 'tableData' },
                    //     ],
                    //     [
                    //         { text: 'Header 1', style: 'tableData' },
                    //         { text: 'Header 2', style: 'tableData' },
                    //         { text: 'Header 3', style: 'tableData' },
                    //     ],
                    // ],
                    body: adviceBody,
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return i === 0 || i === node.table.body.length ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return i === 0 || i === node.table.widths.length
                            ? 2
                            : 1;
                    },
                    hLineColor: function (i, node) {
                        return i === 0 || i === node.table.body.length
                            ? 'black'
                            : 'gray';
                    },
                    vLineColor: function (i, node) {
                        return i === 0 || i === node.table.widths.length
                            ? 'black'
                            : 'gray';
                    },
                },
            },
        ],
        // images: {
        //     logo: 'http://www.aakritihospital.com/wp-content/uploads/2018/09/aakritilogo-1.jpeg',
        // },
        styles: {
            docHeader: {
                fontSize: 25,
                bold: true,
                alignment: 'center',
                margin: 5,
            },
            subHead: {
                alignment: 'center',
            },
            header: {
                fontSize: 18,
                bold: true,
            },
            subheader: {
                fontSize: 16,
                bold: true,
            },
            tableData: {
                alignment: 'center',
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black',
                alignment: 'center',
            },
            tableExample: { margin: [0, 10], alignment: 'left' },
        },
        defaultStyle: {
            columnGap: 20,
            // alignment: 'center',
        },
    };
    console.log('dd', JSON.stringify(dd.content));
    return dd;
}
module.exports = presTemplate;
