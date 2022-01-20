const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const patientSchema = new mongoose.Schema(
    {
        name: { type: String, default: null },
        email: { type: String, default: null },
        address: { type: String, default: null },
        age: { type: Number, default: null },
        gender: { type: String, default: null },
        mobile_number: { type: Number, default: null },
        pt_at: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
            name: { type: String },
        },
        doctor: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'doctor',
            },
            name: { type: String },
        },
        isActive: {
            type: mongoose.Schema.Types.Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

patientSchema.plugin(AutoIncrement, {
    id: 'pt_seq',
    inc_field: 'pt_id',
    reference_fields: ['pt_at.id'],
});

module.exports = mongoose.model('patient', patientSchema);
