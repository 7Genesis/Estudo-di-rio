const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    departamento: {
        type: String,
        required: true
    },
    salario: {
        type: Number,
        required: true
    },
    dataContratacao: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Ativo', 'Inativo', 'Férias'],
        default: 'Ativo'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);