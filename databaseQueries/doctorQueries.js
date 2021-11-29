const doctor = require('../models/doctorModel');

function create_doc(doc) {
    console.log('que', doc);
    return new Promise((resolve, reject) => {
        if (!doc) {
            reject({ code: 400, data: null, message: 'Improper Query' });
        }
        doctor.create(doc, (err, data) => {
            if (err) {
                reject({
                    code: 401,
                    data: null,
                    message: "Couldn't Make Doc",
                });
                return;
            }
            resolve({ code: 200, data });
            return;
        });
    });
}

function find_by_user(filter) {
    console.log('FilterS', filter);
    return new Promise((resolve, reject) => {
        doctor.find({ doc_at: filter }, (err, data) => {
            if (err) {
                reject({
                    code: 401,
                    data: null,
                    message: 'Could Not Find the Data',
                });
                return;
            }
            resolve({ code: 200, data });
        });
    });
}

module.exports = {
    create_doc,
    find_by_user,
};
