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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        docId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'doctor',
        },
    },
    { timestamps: true }
);
// UserSchema.plugin(AutoIncrement, {
//     id: 'inhabitant_seq',
//     inc_field: 'inhabitant_number',
//     reference_fields: ['country', 'city'],
// });

patientSchema.plugin(AutoIncrement, {
    id: 'pt_seq',
    inc_field: 'pt_id',
    reference_fields: ['pt_at'],
});

module.exports = mongoose.model('patient', patientSchema);
