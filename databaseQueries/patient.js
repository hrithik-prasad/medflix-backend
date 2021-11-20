const patient = require('../models/patient');

function create_pt(doc) {
    return new Promise((resolve, reject) => {
        if (!doc) {
            reject({ code: 400, data: 'Improper Query' });
        }
        patient.create(doc, (err, data) => {
            if (err) {
                reject({ code: 401, data: "Couldn't Make pt" });
                return;
            }
            resolve({ code: 200, data });
            return;
        });
    });
}
function find_all(filter) {
    return new Promise((resolve, reject) => {
        patient.find({ pt_at: filter }, (err, data) => {
            if (err) {
                reject({ code: 401, data: "Couldn't Find Data" });
                return;
            }
            resolve({ code: 200, data });
            return;
        });
    });
}
module.exports = {
    create_pt,
    find_all,
};
