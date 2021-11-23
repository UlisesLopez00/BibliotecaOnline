const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usuariSchema = new Schema({
    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    telefono: {
        type: Number
    },
    correo: {
        type: String
    }, 
    password: {
        type: String
    },
    usr_role: {
        type: String,
        default: "admin"
    }
})

module.exports = mongoose.model('Usuario', usuariSchema);