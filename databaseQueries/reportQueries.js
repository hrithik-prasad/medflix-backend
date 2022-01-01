const reportModel = require('../models/reportsModel');

function createReport(doc) {
    return new Promise((resolve, reject) => {
        if (!doc) {
            reject({ code: 400, data: 'document is not defined' });
            return;
        }
        reportModel.create(doc, (err, data) => {
            if (err) {
                reject({ code: 401, data: "Couldn't Make pt" });
                return;
            }
            resolve({ code: 200, data });
            return;
        });
    });
}

function findReport(id) {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject({ code: 400, data: 'ID is not valid' });
        }
        reportModel.findById(id, (err, data) => {
            if (err) {
                reject({ code: 401, data: 'Coudnt Find the report' });
                return;
            }
            if (!data || data.length == 0) {
                resolve({
                    code: 206,
                    data: undefined,
                    message: 'No documents found!',
                });
                return;
            }
            resolve({ code: 200, data });
            return;
        });
    });
}

module.exports = { createReport, findReport };
