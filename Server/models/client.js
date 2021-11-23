const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    telefono: {
        type: String
    },
    direccion: {
        type: String
    }
});

module.exports = mongoose.model('Client', clientSchema);