const mongoose = require('mongoose');

const reportSchmea = new mongoose.Schema(
    {
        patient: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
            name: String,
            pt_id: mongoose.Schema.Types.Number,
        },
        org: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
            name: String,
        },
        doctor: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'doctor',
            },
            name: String,
        },
        reportType: { type: String },
        reportData: { type: Object, default: {} },
    },
    { timestamps: true }
);

const reportModel = mongoose.model('reports', reportSchmea);

module.exports = reportModel;
