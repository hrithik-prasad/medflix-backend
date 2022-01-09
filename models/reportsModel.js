const mongoose = require('mongoose');

const reportSchmea = new mongoose.Schema(
    {
        pt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'patient' },
        pt_at: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        docId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'doctor',
        },
        reportType: { type: String },
        reportData: { type: Object, default: {} },
    },
    { timestamps: true }
);

const reportModel = mongoose.model('reports', reportSchmea);

module.exports = reportModel;
