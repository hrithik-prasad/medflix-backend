const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        name: { type: String, default: null },
        email: { type: String, default: null },
        address: { type: String, default: null },
        age: { type: Number, default: null },
        gender: { type: String, default: null },
        mobile_number: { type: Number, default: null },
        pt_at: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('patient', patientSchema);
