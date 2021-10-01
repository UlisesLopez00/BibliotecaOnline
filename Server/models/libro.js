const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let libroSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'Favor de ingresar el nombre del libro']

    },
    autor: {
        type: String,
        required: [true, 'Favor de ingresar el nombre del autor']
    },
    categoria: {
        type: String,
        required: [true, 'Favor de ingresar la categoria del libro']
    },
    editorial: {
        type: String,
        required: [true, 'Favor de ingresar la editorial del libro']
    },
    fecha: {
        type: String,
        required: true

    },
    img:{
        type:String
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }

});



libroSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});

module.exports = mongoose.model('Libro', libroSchema);